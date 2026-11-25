import { describe, expect, it } from 'vitest'
import type { Doc } from '../richtexteditor-model'
import { BOLD, CODE, ITALIC, UNDERLINE, withFont, withSize } from '../richtexteditor-model'
import { fromHtml, fromText } from '../richtexteditor-parse'
import { safeHref, toHtml, toMarkdown } from '../richtexteditor-serialize'

const doc: Doc = {
  blocks: [
    { type: 'heading1', runs: [{ text: 'Title', marks: 0 }] },
    {
      type: 'paragraph',
      runs: [
        { text: 'plain ', marks: 0 },
        { text: 'bold', marks: BOLD },
        { text: ' ', marks: 0 },
        { text: 'both', marks: BOLD | ITALIC | UNDERLINE },
        { text: ' ', marks: 0 },
        { text: 'x<y', marks: CODE },
        { text: ' ', marks: 0 },
        { text: 'link', marks: 0, href: 'https://a.test/?a=1&b="2"' },
      ],
    },
    { type: 'bullet', runs: [{ text: 'one', marks: 0 }] },
    { type: 'bullet', runs: [{ text: 'two', marks: 0 }] },
    { type: 'ordered', runs: [{ text: 'first', marks: 0 }] },
    { type: 'ordered', runs: [{ text: 'second', marks: 0 }] },
    { type: 'quote', runs: [{ text: 'quoted', marks: 0 }] },
    { type: 'code', runs: [{ text: 'a < b\nc', marks: 0 }] },
    { type: 'paragraph', runs: [] },
    { type: 'paragraph', runs: [{ text: 'a\nb\n', marks: 0 }] },
  ],
}

describe('toHtml', () => {
  it('writes every block and mark', () => {
    expect(toHtml(doc)).toBe(
      '<h1>Title</h1>' +
        '<p>plain <strong>bold</strong> <strong><em><u>both</u></em></strong> <code>x&lt;y</code> ' +
        '<a href="https://a.test/?a=1&amp;b=&quot;2&quot;">link</a></p>' +
        '<ul><li>one</li><li>two</li></ul>' +
        '<ol><li>first</li><li>second</li></ol>' +
        '<blockquote>quoted</blockquote>' +
        '<pre><code>a &lt; b\nc</code></pre>' +
        '<p><br></p>' +
        '<p>a<br>b<br><br></p>',
    )
  })

  it('drops a link that is not safe', () => {
    const unsafe: Doc = {
      blocks: [
        {
          type: 'paragraph',
          runs: [{ text: 'x', marks: 0, href: 'javascript:alert(1)' }],
        },
      ],
    }
    expect(toHtml(unsafe)).toBe('<p>x</p>')
  })

  it('round-trips through fromHtml', () => {
    expect(fromHtml(toHtml(doc))).toEqual(doc)
  })
})

describe('font, size and alignment', () => {
  const styled: Doc = {
    blocks: [
      {
        type: 'paragraph',
        align: 'center',
        runs: [
          { text: 'plain ', marks: 0 },
          { text: 'serif', marks: withFont(BOLD, 'serif') },
          { text: ' ', marks: 0 },
          { text: 'huge mono', marks: withSize(withFont(0, 'mono'), 'huge') },
        ],
      },
      {
        type: 'bullet',
        align: 'end',
        runs: [{ text: 'item', marks: withSize(0, 'small') }],
      },
      { type: 'heading2', align: 'justify', runs: [{ text: 'h', marks: 0 }] },
    ],
  }

  it('writes them as inline styles and reads them back', () => {
    const html = toHtml(styled)
    expect(html).toContain('<p style="text-align:center">')
    expect(html).toContain(
      '<span style="font-family:ui-serif,Georgia,serif"><strong>serif</strong></span>',
    )
    expect(html).toContain(
      '<span style="font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:1.75em">huge mono</span>',
    )
    expect(html).toContain(
      '<ul><li style="text-align:end"><span style="font-size:0.875em">item</span></li></ul>',
    )
    expect(fromHtml(html)).toEqual(styled)
  })

  it('ignores the fonts, sizes and alignments the editor does not offer', () => {
    const blocks = fromHtml(
      '<p style="text-align:left"><span style="font-family:Calibri,sans-serif;font-size:11pt">a</span></p>' +
        '<p align="right"><span style="font-size:1.25em">b</span></p><p style="text-align:start">c</p>',
    ).blocks
    expect(blocks.map((b) => [b.align, b.runs.map((r) => r.marks)])).toEqual([
      [undefined, [0]],
      ['end', [withSize(0, 'large')]],
      [undefined, [0]],
    ])
  })

  it('leaves the alignment out of Markdown and code blocks', () => {
    expect(toMarkdown(styled)).toBe('plain **serif** huge mono\n\n- item\n\n## h')
    expect(fromHtml('<pre style="text-align:center">x</pre>').blocks[0].align).toBeUndefined()
  })
})

describe('safeHref', () => {
  it('keeps relative links and safe schemes', () => {
    expect(safeHref('/a')).toBe('/a')
    expect(safeHref(' https://a.test ')).toBe('https://a.test')
    expect(safeHref('mailto:a@b.c')).toBe('mailto:a@b.c')
    expect(safeHref('#top')).toBe('#top')
  })

  it('rejects scripts, even when disguised', () => {
    expect(safeHref('javascript:alert(1)')).toBeUndefined()
    expect(safeHref('  JaVa\nScRiPt:alert(1)')).toBeUndefined()
    expect(safeHref('data:text/html,x')).toBeUndefined()
    expect(safeHref('')).toBeUndefined()
    expect(safeHref(null)).toBeUndefined()
  })
})

describe('toMarkdown', () => {
  it('writes blocks, marks and links', () => {
    expect(toMarkdown(doc)).toBe(
      [
        '# Title',
        'plain **bold** ***<u>both</u>*** `x<y` [link](https://a.test/?a=1&b="2")',
        '- one\n- two',
        '1. first\n2. second',
        '> quoted',
        '```\na < b\nc\n```',
        '',
        'a  \nb  \n',
      ]
        .join('\n\n')
        .replace('\n\n- two', '\n- two')
        .replace('\n\n2. second', '\n2. second'),
    )
  })

  it('keeps the spaces outside the delimiters', () => {
    const spaced: Doc = {
      blocks: [
        {
          type: 'paragraph',
          runs: [
            { text: ' bold ', marks: BOLD },
            { text: ' ', marks: ITALIC },
          ],
        },
      ],
    }
    expect(toMarkdown(spaced)).toBe(' **bold**  ')
  })

  it('escapes what Markdown would read as syntax', () => {
    const risky: Doc = {
      blocks: [
        { type: 'paragraph', runs: [{ text: '*a* _b_ [c] <d> \\', marks: 0 }] },
        { type: 'paragraph', runs: [{ text: '# not a heading', marks: 0 }] },
        { type: 'paragraph', runs: [{ text: '1. not a list', marks: 0 }] },
        {
          type: 'paragraph',
          runs: [
            { text: 'tick', marks: CODE },
            { text: 'x', marks: 0 },
          ],
        },
        { type: 'paragraph', runs: [{ text: '`a`', marks: CODE }] },
        { type: 'code', runs: [{ text: '```js\nx\n```', marks: 0 }] },
        { type: 'quote', runs: [{ text: 'a\nb', marks: 0 }] },
        { type: 'bullet', runs: [{ text: 'a\nb', marks: 0 }] },
        { type: 'ordered', runs: [{ text: 'a\nb', marks: 0 }] },
        {
          type: 'paragraph',
          runs: [{ text: 'a b', marks: 0, href: '/a b(c)' }],
        },
      ],
    }
    expect(toMarkdown(risky)).toBe(
      [
        '\\*a\\* \\_b\\_ \\[c\\] \\<d\\> \\\\',
        '\\# not a heading',
        '1\\. not a list',
        '`tick`x',
        '`` `a` ``',
        '````\n```js\nx\n```\n````',
        '> a  \n> b',
        '- a  \n  b',
        '1. a  \n   b',
        '[a b](/a%20b(c%29)',
      ].join('\n\n'),
    )
  })
})

describe('fromText', () => {
  it('makes one paragraph per non-empty line', () => {
    expect(fromText('a\r\n\nb').blocks.map((b) => b.runs[0].text)).toEqual(['a', 'b'])
    expect(fromText('').blocks).toEqual([{ type: 'paragraph', runs: [] }])
  })
})

describe('fromHtml', () => {
  const html = (source: string) => fromHtml(source).blocks
  const text = (source: string) =>
    html(source).map((b) => `${b.type}:${b.runs.map((r) => r.text).join('')}`)

  it('maps tags and styles to blocks and marks', () => {
    expect(html('<p><b>a</b><i>b</i><u>c</u><code>d</code><a href="/x">e</a></p>')[0].runs).toEqual(
      [
        { text: 'a', marks: BOLD },
        { text: 'b', marks: ITALIC },
        { text: 'c', marks: UNDERLINE },
        { text: 'd', marks: CODE },
        { text: 'e', marks: 0, href: '/x' },
      ],
    )
    expect(
      html(
        '<p><span style="font-weight: 700; font-style: italic; text-decoration: underline">x</span></p>',
      )[0].runs,
    ).toEqual([{ text: 'x', marks: BOLD | ITALIC | UNDERLINE }])
    expect(html('<p><a href="javascript:x">x</a></p>')[0].runs).toEqual([{ text: 'x', marks: 0 }])
  })

  it('maps headings, quotes, code and lists', () => {
    expect(text('<h1>a</h1><h4>b</h4><blockquote>c</blockquote><pre>d\ne</pre>')).toEqual([
      'heading1:a',
      'heading3:b',
      'quote:c',
      'code:d\ne',
    ])
    expect(text('<ul><li>a<ul><li>b</li></ul></li></ul><ol><li>c</li></ol><li>d</li>')).toEqual([
      'bullet:a',
      'bullet:b',
      'ordered:c',
      'bullet:d',
    ])
    expect(text('<blockquote><p>a</p><p>b</p></blockquote>')).toEqual(['quote:a', 'quote:b'])
  })

  it('collapses whitespace and keeps real line breaks', () => {
    expect(text('<p>  a \n  b   <b> c </b>  </p>')).toEqual(['paragraph:a b c'])
    expect(text('<p>a<br>b<br></p>')).toEqual(['paragraph:a\nb'])
    expect(text('<p>a b​</p>')).toEqual(['paragraph:a b'])
  })

  it('turns loose text and containers into paragraphs', () => {
    expect(text('hello <b>world</b>')).toEqual(['paragraph:hello world'])
    expect(text('<div>a</div><div><div>b</div></div>')).toEqual(['paragraph:a', 'paragraph:b'])
    expect(text('<table><tr><td>a</td><td>b</td></tr></table>')).toEqual([
      'paragraph:a',
      'paragraph:b',
    ])
    expect(text('a<p>b</p>c')).toEqual(['paragraph:a', 'paragraph:b', 'paragraph:c'])
    expect(text('<span>a</span><img src="x"><script>alert(1)</script><style>p{}</style>')).toEqual([
      'paragraph:a',
    ])
    expect(html('')).toEqual([{ type: 'paragraph', runs: [] }])
  })

  it('cleans what Google Docs wraps around a paste', () => {
    const pasted =
      '<meta charset="utf-8"><b style="font-weight:normal;" id="docs-internal-guid-1">' +
      '<p dir="ltr" style="line-height:1.38"><span style="font-size:11pt;font-weight:400">Plain </span>' +
      '<span style="font-weight:700">bold</span></p>' +
      '<ul><li dir="ltr"><p role="presentation"><span style="font-weight:400">item</span></p></li></ul></b>' +
      '<br class="Apple-interchange-newline">'
    const blocks = html(pasted)
    expect(blocks.map((b) => b.type)).toEqual(['paragraph', 'bullet'])
    expect(blocks[0].runs).toEqual([
      { text: 'Plain ', marks: 0 },
      { text: 'bold', marks: BOLD },
    ])
    expect(blocks[1].runs).toEqual([{ text: 'item', marks: 0 }])
  })

  it('cleans what Word wraps around a paste', () => {
    const pasted =
      '<html><body><!--StartFragment--><p class=MsoNormal><span style="mso-bidi-font-weight:normal">Intro<o:p></o:p></span></p>' +
      '<p class=MsoListParagraphCxSpFirst style="mso-list:l0 level1 lfo1"><!--[if !supportLists]-->' +
      '<span style="mso-list:Ignore">·<span>&nbsp;&nbsp;</span></span><!--[endif]-->Apples</p>' +
      '<p class=MsoListParagraphCxSpLast style="mso-list:l1 level1 lfo2"><!--[if !supportLists]-->' +
      '<span style="mso-list:Ignore">1.<span>&nbsp;</span></span><!--[endif]-->First</p><!--EndFragment--></body></html>'
    expect(text(pasted)).toEqual(['paragraph:Intro', 'bullet:Apples', 'ordered:First'])
  })

  it('reads its own DOM with the whitespace it holds', () => {
    const root = document.createElement('div')
    root.innerHTML = '<p>a  b</p><ul><li>c<br><br></li></ul>'
    const { doc: parsed, elements } = parseDomFor(root)
    expect(parsed.blocks.map((b) => b.runs[0].text)).toEqual(['a  b', 'c\n'])
    expect(elements).toHaveLength(2)
  })
})

import { parseDom } from '../richtexteditor-parse'
const parseDomFor = (root: HTMLElement) => parseDom(root, true)
