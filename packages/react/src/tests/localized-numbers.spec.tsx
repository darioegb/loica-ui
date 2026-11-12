import { render, screen } from '@testing-library/react'
import { Avatar, AvatarGroup } from '../components/presentation/avatar'
import { Carousel, CarouselDots, CarouselSlide, CarouselSlides } from '../components/utility/carousel'
import { PinInput } from '../components/form/pininput'
import { Rating } from '../components/form/rating'
import { Select, SelectContent, SelectOption, SelectTrigger } from '../components/form/select'
import { Textarea } from '../components/form/textarea'
import { LocaleProvider } from '../locale/locale-provider'

const digits = (locale: string, value: number): string =>
  new Intl.NumberFormat(locale, { maximumFractionDigits: 20 }).format(value)

const inLocale = (locale: string, node: React.ReactNode): React.ReactNode => (
  <LocaleProvider locale={locale}>{node}</LocaleProvider>
)

beforeEach(() => {
  Element.prototype.scrollTo = vi.fn()
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    addEventListener: vi.fn(),
    addListener: vi.fn(),
    dispatchEvent: vi.fn(),
    matches: false,
    media: query,
    onchange: null,
    removeEventListener: vi.fn(),
    removeListener: vi.fn(),
  }))
})

describe('the numbers of the default texts', () => {
  describe.each(['ar-EG', 'fa', 'bn'])('in %s, which writes its own digits', (locale) => {
    it('Rating names its stars and its read only value', () => {
      const { unmount } = render(inLocale(locale, <Rating aria-label="Stars" max={3} />))
      expect(screen.getByRole('radio', { name: `${digits(locale, 2)} stars` })).toBeInTheDocument()
      unmount()
      render(inLocale(locale, <Rating aria-label="Stars" defaultValue={3} readOnly />))
      expect(
        screen.getByText(`${digits(locale, 3)} out of ${digits(locale, 5)}`),
      ).toBeInTheDocument()
    })

    it('Textarea writes its count and the characters left', () => {
      render(inLocale(locale, <Textarea aria-label="Bio" defaultValue="Hello" maxLength={20} showCount />))
      expect(
        screen.getByText(`${digits(locale, 5)} / ${digits(locale, 20)}`),
      ).toBeInTheDocument()
    })

    it('Select counts the chips it hides', () => {
      render(
        inLocale(
          locale,
          <Select defaultValue={['a', 'b', 'c']} multiple>
            <SelectTrigger aria-label="Letters" maxDisplay={2} />
            <SelectContent>
              <SelectOption value="a">A</SelectOption>
              <SelectOption value="b">B</SelectOption>
              <SelectOption value="c">C</SelectOption>
            </SelectContent>
          </Select>,
        ),
      )
      expect(screen.getByText(`+${digits(locale, 1)}`)).toBeInTheDocument()
    })

    it('AvatarGroup names the avatars it hides', () => {
      render(
        inLocale(
          locale,
          <AvatarGroup aria-label="Team" max={1}>
            <Avatar name="Ada Lovelace" />
            <Avatar name="Grace Hopper" />
            <Avatar name="Margaret Hamilton" />
          </AvatarGroup>,
        ),
      )
      expect(screen.getByRole('img', { name: `${digits(locale, 2)} more` })).toBeInTheDocument()
    })

    it('Carousel names its slides and its dots', () => {
      render(
        inLocale(
          locale,
          <Carousel aria-label="Photos">
            <CarouselSlides>
              {[1, 2, 3].map((position) => (
                <CarouselSlide key={position}>Slide {position}</CarouselSlide>
              ))}
            </CarouselSlides>
            <CarouselDots />
          </Carousel>,
        ),
      )
      const total = digits(locale, 3)
      expect(screen.getAllByRole('tab')[0]).toHaveAttribute(
        'aria-label',
        `Slide ${digits(locale, 1)} of ${total}`,
      )
      expect(
        screen.getAllByRole('tabpanel').map((panel) => panel.getAttribute('aria-label')),
      ).toEqual([1, 2, 3].map((position) => `${digits(locale, position)} of ${total}`))
    })

    it('PinInput names its cells', () => {
      render(inLocale(locale, <PinInput aria-label="Code" length={3} />))
      expect(screen.getAllByRole('textbox')[1]).toHaveAttribute(
        'aria-label',
        `Digit ${digits(locale, 2)} of ${digits(locale, 3)}`,
      )
    })
  })

  it('writes the decimals of a rating with the separator of the locale', () => {
    render(inLocale('de', <Rating allowHalf aria-label="Stars" defaultValue={3.5} readOnly />))
    expect(screen.getByText('3,5 out of 5')).toBeInTheDocument()
  })

  it('writes the thousands with the separator of the locale', () => {
    const { unmount } = render(
      <Textarea aria-label="Bio" maxLength={5000} showCount value={'a'.repeat(1200)} />,
    )
    expect(screen.getByText('1,200 / 5,000')).toBeInTheDocument()
    unmount()
    render(
      inLocale('de', <Textarea aria-label="Bio" maxLength={5000} showCount value={'a'.repeat(1200)} />),
    )
    expect(screen.getByText('1.200 / 5.000')).toBeInTheDocument()
  })

  it('follows the locale of the LocaleProvider when it changes', () => {
    const { rerender } = render(inLocale('en', <PinInput aria-label="Code" length={2} />))
    expect(screen.getAllByRole('textbox')[0]).toHaveAttribute('aria-label', 'Digit 1 of 2')
    rerender(inLocale('ar-EG', <PinInput aria-label="Code" length={2} />))
    expect(screen.getAllByRole('textbox')[0]).toHaveAttribute(
      'aria-label',
      `Digit ${digits('ar-EG', 1)} of ${digits('ar-EG', 2)}`,
    )
  })
})
