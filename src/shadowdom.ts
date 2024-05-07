/** @see https://github.com/facebook/react/pull/15894#issuecomment-549687672 */

export const create = () => {
  const parasitifer = document.createElement('div')

  const root = parasitifer.attachShadow({ mode: 'open' })
  const html = document.createElement('html')
  const head = document.createElement('head')
  const body = document.createElement('body')
  const main = document.createElement('main')

  body.append(main)
  html.append(head)
  html.append(body)
  root.append(html)

  return {
    parasitifer,
    root,
    html,
    head,
    body,
    main,
  }
}

export const mount = (position: 'first' | 'last', element: HTMLElement) => {
  if (position === 'first') {
    const first = document.body.firstChild
    document.body.insertBefore(element, first)
  } else {
    document.body.append(element)
  }
}
