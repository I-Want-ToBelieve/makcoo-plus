import { createContext } from 'react'

export const CircleMenuContext = createContext<{
  root: HTMLElement
}>({
  root: document.getElementsByTagName('body')[0],
})
