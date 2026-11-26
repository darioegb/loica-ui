import { cssModule } from '../css-check'

const classes = { box: '_box_1', wide: '_wide_1' }

describe('cssModule', () => {
  let warn: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    vi.useFakeTimers()
    warn = vi.spyOn(console, 'warn').mockImplementation(() => undefined)
    vi.stubEnv('NODE_ENV', 'development')
    vi.spyOn(navigator, 'userAgent', 'get').mockReturnValue('Mozilla/5.0 Chrome/120')
  })

  afterEach(() => {
    vi.useRealTimers()
    warn.mockRestore()
    document.documentElement.style.removeProperty('--loica-css-card')
    vi.unstubAllEnvs()
  })

  it('gives the class names as they are', () => {
    const styles = cssModule('card', classes)
    expect(styles.box).toBe('_box_1')
    expect(styles.wide).toBe('_wide_1')
    expect(Object.keys(styles)).toEqual(['box', 'wide'])
  })

  it('warns once, naming the sheet, when the CSS of the unit is not loaded', () => {
    const styles = cssModule('card-missing', classes)
    expect(warn).not.toHaveBeenCalled()
    void styles.box
    void styles.wide
    expect(warn).not.toHaveBeenCalled()
    vi.runAllTimers()
    expect(warn).toHaveBeenCalledTimes(1)
    expect(warn.mock.calls[0][0]).toContain('card-missing')
    expect(warn.mock.calls[0][0]).toContain('@loica-ui/react/css/card-missing.css')
    expect(warn.mock.calls[0][0]).toContain('@loica-ui/react/styles.css')
  })

  it('does not warn twice for the same unit, even from another module', () => {
    void cssModule('card-twice', classes).box
    void cssModule('card-twice', classes).box
    vi.runAllTimers()
    expect(warn).toHaveBeenCalledTimes(1)
  })

  it('does not warn when the sheet has set its marker', () => {
    document.documentElement.style.setProperty('--loica-css-card', '1')
    void cssModule('card', classes).box
    vi.runAllTimers()
    expect(warn).not.toHaveBeenCalled()
  })

  it('does not look at the page when there is no document', () => {
    vi.stubGlobal('document', undefined)
    try {
      expect(cssModule('card-server', classes).box).toBe('_box_1')
      vi.runAllTimers()
      expect(warn).not.toHaveBeenCalled()
    } finally {
      vi.unstubAllGlobals()
    }
  })

  it.each([
    ['NODE_ENV is test', () => vi.stubEnv('NODE_ENV', 'test')],
    [
      'the page runs in jsdom',
      () => vi.spyOn(navigator, 'userAgent', 'get').mockReturnValue('Mozilla/5.0 jsdom/26.0.0'),
    ],
    [
      'the page runs in happy-dom',
      () => vi.spyOn(navigator, 'userAgent', 'get').mockReturnValue('Mozilla/5.0 HappyDOM/15.0.0'),
    ],
  ])('does not warn when %s', (_, setup) => {
    setup()
    void cssModule('card-tests', classes).box
    vi.runAllTimers()
    expect(warn).not.toHaveBeenCalled()
  })

  it('returns the object itself in production, with no check', () => {
    vi.stubEnv('NODE_ENV', 'production')
    const styles = cssModule('card-production', classes)
    expect(styles).toBe(classes)
    void styles.box
    vi.runAllTimers()
    expect(warn).not.toHaveBeenCalled()
  })
})
