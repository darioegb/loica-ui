import { render, screen } from '@testing-library/react'
import path from 'node:path'
import ts from 'typescript'
import { Loader } from '../../components/presentation/loader'
import { Paginator } from '../../components/interaction/paginator'
import { LocaleProvider } from '../../locale'
import type { LocaleMessages } from '../../locale/messages'
import { de } from '../de'
import { es } from '../es'
import { fr } from '../fr'
import { it as italian } from '../it'
import { pt } from '../pt'

type Kind = 'function' | 'text'

const locales: Record<string, LocaleMessages> = { de, es, fr, it: italian, pt }

const file = new File(['a'], 'report.pdf')

const samples: Record<string, unknown[][]> = {
  'avatarGroup.overflow': [[3]],
  'carousel.dot': [[0, 5]],
  'carousel.slide': [[0, 5]],
  'colorPicker.areaValue': [[50, 60]],
  'commandPalette.results': [[1], [2]],
  'datePicker.format': [['dd/MM/yyyy']],
  'fileUpload.progress': [[file]],
  'fileUpload.rejection': [
    [{ file, reason: 'count' }],
    [{ file, reason: 'size' }],
    [{ file, reason: 'type' }],
  ],
  'fileUpload.remove': [[file]],
  'paginator.page': [
    [2, false],
    [2, true],
  ],
  'paginator.summary': [[1, 10, 100]],
  'pinInput.input': [[1, 6]],
  'rating.item': [[1], [2]],
  'rating.readOnly': [[3, 5]],
  'select.overflow': [[2]],
  'select.remove': [['Tag']],
  'slider.thumb': [[0], [1]],
  'splitter.resize': [
    [1, 1],
    [1, 3],
  ],
  'textarea.count': [
    [5, undefined],
    [5, 10],
  ],
  'textarea.remaining': [[1], [2]],
  'timePicker.format': [['hh:mm']],
  'timePicker.placeholder': [[undefined], ['AM']],
  'tour.progress': [[1, 3]],
}

function expectedKeys(): Map<string, Kind> {
  const messages = path.resolve(import.meta.dirname, '../../locale/messages.ts')
  const program = ts.createProgram([messages], {
    jsx: ts.JsxEmit.ReactJSX,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.Bundler,
    noEmit: true,
    skipLibCheck: true,
    strict: true,
    target: ts.ScriptTarget.ES2020,
    types: [],
  })
  const checker = program.getTypeChecker()
  const declaration = program
    .getSourceFile(messages)
    ?.statements.find(
      (statement): statement is ts.TypeAliasDeclaration =>
        ts.isTypeAliasDeclaration(statement) && statement.name.text === 'LocaleMessages',
    )
  if (!declaration) throw new Error('LocaleMessages is not declared')
  const keys = new Map<string, Kind>()
  for (const group of checker.getPropertiesOfType(checker.getTypeAtLocation(declaration.name))) {
    const groupType = checker.getTypeOfSymbolAtLocation(group, declaration)
    for (const text of checker.getPropertiesOfType(groupType)) {
      const textType = checker.getTypeOfSymbolAtLocation(text, declaration)
      keys.set(
        `${group.name}.${text.name}`,
        textType.getCallSignatures().length > 0 ? 'function' : 'text',
      )
    }
  }
  return keys
}

const flatten = (messages: LocaleMessages): Map<string, unknown> =>
  new Map(
    Object.entries(messages).flatMap(([group, texts]) =>
      Object.entries(texts as Record<string, unknown>).map(([key, value]) => [
        `${group}.${key}`,
        value,
      ]),
    ),
  )

describe('bundled locales', () => {
  const expected = expectedKeys()

  it('reads every key of MessageMap', () => {
    expect(expected.size).toBeGreaterThan(100)
    expect(expected.get('paginator.summary')).toBe('function')
    expect(expected.get('paginator.first')).toBe('text')
    expect(expected.has('fileUpload.fileSize')).toBe(false)
  })

  describe.each(Object.entries(locales))('%s', (_name, messages) => {
    const texts = flatten(messages)

    it('has every key of MessageMap, and no other', () => {
      expect([...texts.keys()].sort()).toEqual([...expected.keys()].sort())
    })

    it('writes each text as a string or a function, like the default', () => {
      for (const [key, kind] of expected) {
        expect(typeof texts.get(key), key).toBe(kind === 'function' ? 'function' : 'string')
      }
    })

    it('answers every function with a text that has no undefined or NaN in it', () => {
      for (const [key, value] of texts) {
        if (typeof value !== 'function') continue
        for (const args of samples[key] ?? [[1, 2, 3]]) {
          const result = (value as (...values: unknown[]) => unknown)(...args)
          expect(typeof result, key).toBe('string')
          expect(result, key).not.toMatch(/undefined|NaN/)
          expect((result as string).length, key).toBeGreaterThan(0)
        }
      }
    })
  })

  describe('plurals', () => {
    const results = (messages: LocaleMessages, count: number): string =>
      messages.commandPalette.results(count)

    it('uses the plural rules of the language', () => {
      expect(results(es, 1)).toBe('1 resultado')
      expect(results(es, 0)).toBe('0 resultados')
      expect(results(fr, 0)).toBe('0 résultat')
      expect(results(fr, 2)).toBe('2 résultats')
      expect(results(de, 1)).toBe('1 Ergebnis')
      expect(results(de, 2)).toBe('2 Ergebnisse')
      expect(results(italian, 1)).toBe('1 risultato')
      expect(results(italian, 0)).toBe('0 risultati')
      expect(results(pt, 0)).toBe('0 resultado')
      expect(results(pt, 2)).toBe('2 resultados')
    })

    it('takes a fraction as the plural, as the language does', () => {
      expect(es.rating.item(1.5, 5)).toBe('1,5 estrellas')
      expect(fr.rating.item(1.5, 5)).toBe('1,5 étoile')
    })

    it('inflects the characters that are left', () => {
      expect(es.textarea.remaining(1)).toBe('Queda 1 carácter')
      expect(es.textarea.remaining(12)).toBe('Quedan 12 caracteres')
      expect(fr.textarea.remaining(1)).toBe('1 caractère restant')
      expect(italian.textarea.remaining(1)).toBe('1 carattere rimasto')
      expect(pt.textarea.remaining(5)).toBe('5 caracteres restantes')
      expect(de.textarea.remaining(1)).toBe('1 Zeichen übrig')
    })
  })

  describe('numbers', () => {
    it('writes them with the separators of the language', () => {
      expect(de.paginator.summary(1, 10, 12345)).toBe('1–10 von 12.345')
      expect(es.paginator.summary(1, 10, 1234)).toBe('1–10 de 1234')
      expect(pt.paginator.summary(1, 10, 12345)).toBe('1–10 de 12.345')
    })
  })

  describe('in a component', () => {
    it.each([
      ['de', de, 'Wird geladen', 'Seite 2'],
      ['es', es, 'Cargando', 'Página 2'],
      ['fr', fr, 'Chargement', 'Page 2'],
      ['it', italian, 'Caricamento', 'Pagina 2'],
      ['pt', pt, 'Carregando', 'Página 2'],
    ])('%s reaches the components below the provider', (locale, messages, loading, page) => {
      render(
        <LocaleProvider locale={locale} messages={messages}>
          <Loader />
          <Paginator page={1} pageSize={1} total={3} />
        </LocaleProvider>,
      )
      expect(screen.getByRole('status', { name: loading })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: page })).toBeInTheDocument()
    })

    it('lets the messages of the app win over the language', () => {
      render(
        <LocaleProvider locale="es" messages={es}>
          <LocaleProvider messages={{ loader: { label: 'Guardando' } }}>
            <Loader />
          </LocaleProvider>
        </LocaleProvider>,
      )
      expect(screen.getByRole('status', { name: 'Guardando' })).toBeInTheDocument()
    })
  })
})
