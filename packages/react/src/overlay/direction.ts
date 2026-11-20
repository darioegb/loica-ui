const mirrored: Record<string, string> = { ArrowLeft: 'ArrowRight', ArrowRight: 'ArrowLeft' }

export const isRtl = (element: Element | null): boolean =>
  !!element && getComputedStyle(element).direction === 'rtl'

export const logicalKey = (key: string, element: Element | null): string =>
  (isRtl(element) && mirrored[key]) || key
