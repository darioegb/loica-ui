import { mkdirSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const here = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(here, '../../..')
const packageDir = path.join(root, 'packages/react')
const componentsDir = path.join(packageDir, 'src/components')
const output = path.resolve(here, '../src/api.generated.json')

const require = createRequire(path.join(packageDir, 'package.json'))
const ts = require('typescript')

const HIDDEN_PROPS = new Set(['className', 'style', 'index'])
const NATIVE_LIST_LIMIT = 30
const INTERNAL_PROPS = new Set(['key', 'ref'])

const config = ts.readConfigFile(path.join(packageDir, 'tsconfig.json'), ts.sys.readFile)
const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, packageDir)
const program = ts.createProgram({
  options: { ...parsed.options, noEmit: true },
  rootNames: parsed.fileNames.filter((file) => /\/src\/components\/[^/]+\/[^/]+\/index\.ts$/.test(file)),
})
const checker = program.getTypeChecker()

const isOwn = (declaration) => {
  const file = declaration.getSourceFile().fileName
  return file.startsWith(path.join(packageDir, 'src')) && !file.includes('node_modules')
}

const isShared = (declaration) =>
  declaration.getSourceFile().fileName.endsWith('/theme/shared.types.ts')

const docOf = (symbol) => ts.displayPartsToString(symbol.getDocumentationComment(checker)).trim()

const tagOf = (symbol, name) =>
  symbol
    .getJsDocTags(checker)
    .find((tag) => tag.name === name)
    ?.text?.map((part) => part.text)
    .join('')
    .trim()

// Only tagged symbols carry `since`, so the generated file does not change for the rest.
const sinceOf = (symbol) => {
  const since = tagOf(symbol, 'since')
  return since ? { since } : {}
}

const typeToString = (type, location) =>
  checker.typeToString(
    type,
    location,
    ts.TypeFormatFlags.NoTruncation | ts.TypeFormatFlags.UseAliasDefinedOutsideCurrentScope,
  )


const UNION_LIMIT = 8

const describeType = (annotation, type, location) => {
  if (!annotation) return typeToString(type, location)
  const text = annotation.getText().replace(/\s+/g, ' ').trim()
  const isAlias = ts.isTypeReferenceNode(annotation) && !annotation.typeArguments
  if (isAlias && type.isUnion() && type.types.length <= UNION_LIMIT) {
    const literals = type.types.every(
      (member) => member.isLiteral() || (member.flags & ts.TypeFlags.BooleanLiteral) !== 0,
    )
    if (literals) return type.types.map((member) => typeToString(member, location)).join(' | ')
  }
  return text
}

const mergeProps = (lists) => {
  const merged = new Map()
  for (const list of lists) {
    for (const prop of list) {
      const known = merged.get(prop.name)
      if (!known) {
        merged.set(prop.name, { ...prop })
        continue
      }
      known.required = known.required && prop.required
      known.description = known.description || prop.description
      known.default = known.default ?? prop.default
      known.since = known.since ?? prop.since
      const parts = (type) => (type.includes('=>') ? [`(${type})`] : type.split(' | '))
      const combined = [...new Set([...parts(known.type), ...parts(prop.type)])]
      known.type = combined.join(' | ')
    }
  }
  return [...merged.values()]
}

const propsOf = (propsType, location) => {
  if (!propsType.isUnion()) return propsOfMember(propsType, location)
  const members = propsType.types.map((member) => propsOfMember(member, location))
  const own = mergeProps(members.map((member) => member.own))
  own.sort((a, b) => Number(b.required) - Number(a.required) || a.name.localeCompare(b.name))
  const native = [...new Set(members.flatMap((member) => member.native))].sort((a, b) =>
    a.localeCompare(b),
  )
  return { native, own }
}

const propsOfMember = (propsType, location) => {
  const own = []
  const native = []
  for (const property of checker.getPropertiesOfType(propsType)) {
    const name = property.getName()
    const declarations = property.getDeclarations() ?? []
    if (declarations.length === 0 || INTERNAL_PROPS.has(name)) continue
    if (!declarations.some(isOwn)) {
      native.push(name)
      continue
    }
    if (HIDDEN_PROPS.has(name) && declarations.some(isShared)) continue
    const type = checker.getTypeOfSymbolAtLocation(property, location)
    const optional = (property.getFlags() & ts.SymbolFlags.Optional) !== 0
    const annotation = declarations.find((declaration) => declaration.type)?.type
    const shown = optional ? checker.getNonNullableType(type) : type
    own.push({
      default: tagOf(property, 'default') ?? null,
      description: docOf(property),
      name,
      required: !optional,
      ...sinceOf(property),
      type: describeType(annotation, shown, location),
    })
  }
  own.sort((a, b) => Number(b.required) - Number(a.required) || a.name.localeCompare(b.name))
  native.sort((a, b) => a.localeCompare(b))
  return { native, own }
}

const USE_CLIENT = /^\s*(['"])use client\1/

// A module renders on the server when it has no 'use client' (check-client-directives keeps the directive exact).
// It still brings a client piece when it renders a component from a client module, directly or through another
// server module: the counter of a Textarea, the Modal parts behind the Drawer parts.
const isClientFile = (sourceFile) => USE_CLIENT.test(sourceFile.text)
const ownSource = (file) => file.startsWith(path.join(packageDir, 'src')) && !file.includes('node_modules')

const clientPieceCache = new Map()
const importsClientPiece = (sourceFile, seen = new Set()) => {
  if (clientPieceCache.has(sourceFile.fileName)) return clientPieceCache.get(sourceFile.fileName)
  if (seen.has(sourceFile.fileName)) return false
  seen.add(sourceFile.fileName)
  let found = false
  for (const statement of sourceFile.statements) {
    if (found) break
    if (!ts.isImportDeclaration(statement) || statement.importClause?.isTypeOnly) continue
    const clause = statement.importClause
    const names = [
      ...(clause?.name ? [clause.name] : []),
      ...(clause?.namedBindings && ts.isNamedImports(clause.namedBindings)
        ? clause.namedBindings.elements.filter((element) => !element.isTypeOnly).map((element) => element.name)
        : []),
    ]
    for (const name of names) {
      const symbol = checker.getSymbolAtLocation(name)
      const target = symbol && symbol.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(symbol) : symbol
      if (!target || !(target.flags & ts.SymbolFlags.Value)) continue
      const declared = (target.valueDeclaration ?? target.declarations?.[0])?.getSourceFile()
      if (!declared || !ownSource(declared.fileName)) continue
      if (isClientFile(declared) || importsClientPiece(declared, seen)) {
        found = true
        break
      }
    }
  }
  clientPieceCache.set(sourceFile.fileName, found)
  return found
}

const renderingOf = (sourceFile) => {
  if (isClientFile(sourceFile)) return { rendering: 'client' }
  return importsClientPiece(sourceFile) ? { clientPiece: true, rendering: 'server' } : { rendering: 'server' }
}

const api = {}

for (const file of program.getRootFileNames().sort()) {
  const source = program.getSourceFile(file)
  const moduleSymbol = source && checker.getSymbolAtLocation(source)
  if (!moduleSymbol) continue
  const folder = path.basename(path.dirname(file))
  if (folder === 'shared') continue
  const components = []
  for (const exported of checker.getExportsOfModule(moduleSymbol)) {
    const name = exported.getName()
    if (!/^[A-Z]/.test(name)) continue
    const target =
      exported.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(exported) : exported
    if (!(target.flags & (ts.SymbolFlags.Variable | ts.SymbolFlags.Function))) continue
    const declaration = target.valueDeclaration ?? target.declarations?.[0]
    if (!declaration) continue
    const type = checker.getTypeOfSymbolAtLocation(target, declaration)
    const signature = type.getCallSignatures()[0]
    const parameter = signature?.getParameters()[0]
    if (!parameter) continue
    const propsType = checker.getTypeOfSymbolAtLocation(parameter, declaration)
    const { native, own } = propsOf(propsType, declaration)
    components.push({
      description: docOf(target),
      name,
      native: native.length > NATIVE_LIST_LIMIT ? [] : native,
      nativeAll: native.length > NATIVE_LIST_LIMIT,
      props: own,
      ...renderingOf(declaration.getSourceFile()),
      ...sinceOf(target),
    })
  }
  if (components.length > 0) api[folder] = components
}

mkdirSync(path.dirname(output), { recursive: true })
writeFileSync(output, `${JSON.stringify(api, null, 2)}\n`)
console.log(
  `API reference: ${Object.values(api).flat().length} components from ${Object.keys(api).length} folders`,
)
