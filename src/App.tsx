/* eslint-disable react/jsx-no-bind */

import { ButtonHTMLAttributes, useEffect } from 'react'
import * as ReactDOMClient from 'react-dom/client'
import { Rnd } from 'react-rnd'
import { useBoolean, useCopyToClipboard, useLocalStorage } from 'react-use'
import { BellIcon, CopyIcon, InfoIcon, SunIcon } from '@chakra-ui/icons'
import { ChakraProvider, extendTheme, useToast } from '@chakra-ui/react'
import createCache from '@emotion/cache'
import { css } from '@emotion/css'
import { CacheProvider, Global as GlobalStyles } from '@emotion/react'

import {
  CircleMenu,
  CircleMenuContext,
  CircleMenuItem,
  TooltipPlacement,
} from './components/FloatButton'
import { colors } from './colors'
import { create, mount } from './shadowdom'

const hosts = [
  'https://www.makcoocode.com',
  'https://gui.makcoocode.com',
] as const
type Hosts = typeof hosts
type Host = Hosts[number]

const App = ({ root }: { root: HTMLElement }) => {
  const [, copyToClipboard] = useCopyToClipboard()
  const toast = useToast()
  const [rndLocalStorage, setRndLocalStorage, removeRndLocalStorage] =
    useLocalStorage('rnd', {
      position: {
        x: 0,
        y: 0,
      },
    })
  const [hasMoved, toggleHasMoved] = useBoolean(false)

  useEffect(() => {
    ;(unsafeWindow as typeof window).console.log(443244444)
  })

  return (
    <div>
      <Rnd
        default={{
          x: rndLocalStorage?.position.x ?? 0,
          y: rndLocalStorage?.position.y ?? 0,
          width: 50,
          height: 50,
        }}
        onDragStop={(event, data) => {
          const hasMoved = !(
            rndLocalStorage?.position.x === data.x &&
            rndLocalStorage?.position.y === data.y
          )

          toggleHasMoved(hasMoved)

          setRndLocalStorage({
            position: {
              x: data.x,
              y: data.y,
            },
          })
        }}
        resizable={String(false)}
      >
        <CircleMenuContext.Provider
          value={{
            root,
          }}
        >
          <CircleMenu
            startAngle={-90}
            rotationAngle={360}
            itemSize={2}
            radius={5}
            /**
             * rotationAngleInclusive (default true)
             * Whether to include the ending angle in rotation because an
             * item at 360deg is the same as an item at 0deg if inclusive.
             * Leave this prop for angles other than 360deg unless otherwise desired.
             */
            rotationAngleInclusive={false}
            disableClick={hasMoved}
          >
            <CircleMenuItem
              onClick={async () => {
                const getText = async ({ origin }: { origin: string }) => {
                  if (!hosts.includes(origin as any)) {
                    throw new Error(`can't work in ${origin}`)
                  }

                  const methods = {
                    'https://www.makcoocode.com': {
                      async getText() {
                        const { href } = window.location
                        const title =
                          (
                            document.querySelector(
                              'span.editable-value'
                            ) as HTMLSpanElement
                          )?.innerText ?? 'title'
                        const url = href
                        return `sfe-workflow-cli --name zhiyong.yu --mr --title "${title}" --description "${url}" --copy --open --write-log`
                      },
                    },
                    'https://gui.makcoocode.com': {
                      async getText() {
                        return 'getText()'
                      },
                    },
                  }

                  return methods[origin as Host].getText()
                }
                const { origin } = window.location

                const text = origin

                copyToClipboard(text)

                toast({
                  title: `copied to clipboard!`,
                  variant: 'top-accent',
                  status: 'success',
                  position: 'top',
                  duration: 3e3,
                })
              }}
              tooltip="Copy"
              tooltipPlacement={TooltipPlacement.Right}
            >
              <CopyIcon />
            </CircleMenuItem>
            <CircleMenuItem tooltip="Bell">
              <BellIcon />
            </CircleMenuItem>
            <CircleMenuItem
              tooltip="Sun"
              onClick={async () => {
                const getText = async ({ origin }: { origin: string }) => {
                  if (!hosts.includes(origin as any)) {
                    throw new Error(`can't work in ${origin}`)
                  }

                  const methods = {
                    'https://www.makcoocode.com': {
                      async getText() {
                        const title =
                          (
                            document.querySelector(
                              'span.editable-value'
                            ) as HTMLSpanElement
                          )?.innerText ?? 'title'

                        return `git commit -m "feat: ${title}"`
                      },
                    },
                    'https://gui.makcoocode.com': {
                      async getText() {
                        const title =
                          (
                            document.querySelector(
                              '[data-qa-selector="title_content"]'
                            ) as HTMLSpanElement
                          )?.innerText ?? 'title'
                        const targetBranch = (
                          document.querySelector(
                            '.js-target-branch'
                          ) as HTMLAnchorElement
                        ).text.trim()
                        const tapdUrl = (
                          document.querySelector(
                            '.description a'
                          ) as HTMLAnchorElement
                        ).textContent
                        const { href } = window.location

                        return `- [${title}](${tapdUrl})｜[【MR：特性 -> ${targetBranch.toUpperCase()}】](${href})`
                      },
                    },
                  }

                  return methods[origin as Host].getText()
                }
                const { origin } = window.location

                const text = await getText({
                  origin,
                })

                copyToClipboard(text)

                toast({
                  title: `copied to clipboard!`,
                  variant: 'top-accent',
                  status: 'success',
                  position: 'top',
                  duration: 3e3,
                })
              }}
            >
              <SunIcon />
            </CircleMenuItem>
            <CircleMenuItem tooltip="Info">
              <InfoIcon />
            </CircleMenuItem>
          </CircleMenu>
        </CircleMenuContext.Provider>
      </Rnd>
    </div>
  )
}

export const _createApp = () => {
  const stripe = extendTheme({
    colors: { ...colors },
  })

  const { head, body, main, parasitifer } = create()

  parasitifer.classList.add(
    css`
      display: display;
      position: fixed;
      bottom: 200px;
      right: 100px;
      z-index: 9999;
      width: 100px;
      height: 100px;
      font-size: 16px;
      background-color: transparent;
    `
  )

  mount('last', parasitifer)

  /** @see https://emotion.sh/docs/@emotion/cache#createcache */
  const cacheEmotionForShadowDom = createCache({
    key: 'userscript-shadow-dom',
    container: head,
  })

  ReactDOMClient.createRoot(main).render(
    <CacheProvider value={cacheEmotionForShadowDom}>
      <ChakraProvider theme={stripe}>
        <App root={body} />
        <GlobalStyles
          styles={{
            body: {
              backgroundColor: 'transparent !important',
            },
          }}
        />
      </ChakraProvider>
    </CacheProvider>
  )
}

export const singleton = <A extends any[], R>(
  factory: (...args: A) => R
): ((...args: A) => R) => {
  let instance: R

  return (...args) => {
    if (!instance) {
      instance = factory(...args)
    }

    return instance
  }
}

export const createApp = singleton(_createApp)
export default createApp
