const reported = new Set<string>()

function warnIfMissing(unit: string): void {
  const marker = getComputedStyle(document.documentElement).getPropertyValue(`--loica-css-${unit}`)
  if (marker.trim() !== '') return
  console.warn(
    `Loica: the CSS of ${unit} is not loaded, so it renders unstyled. Import '@loica-ui/react/css/${unit}.css', or '@loica-ui/react/styles.css' for every component.`,
  )
}

const SIMULATED_DOM = /jsdom|happydom/i

// Test runners load no stylesheets, so every component would warn in the tests of whoever uses the package.
function inTests(): boolean {
  return process.env.NODE_ENV === 'test' || SIMULATED_DOM.test(navigator.userAgent)
}

function check(unit: string): void {
  if (reported.has(unit) || typeof document === 'undefined' || inTests()) return
  reported.add(unit)
  setTimeout(() => warnIfMissing(unit), 0)
}

export function cssModule<T extends Record<string, string>>(unit: string, classes: T): T {
  if (process.env.NODE_ENV !== 'production') {
    return new Proxy(classes, {
      get(target, key, receiver): unknown {
        check(unit)
        return Reflect.get(target, key, receiver)
      },
    })
  }
  return classes
}
