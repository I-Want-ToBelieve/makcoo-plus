import fs from 'node:fs'
import http from 'node:http'
import { createRequire } from 'node:module'
import path, { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import { bold, cyan, green, red } from 'colorette'
import * as rollup from 'rollup'
import metablock from 'rollup-plugin-userscript-metablock'
import handler from 'serve-handler'

import meta from './meta.json'
import pkg from './package.json'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

console.log('👀 watch & serve 🤲\n###################\n')

const port = pkg.config.port
const destDir = 'dist/'
const devScriptInFile = 'dev.user.js'

const require = createRequire(import.meta.url)
const loadConfigFile = require('rollup/dist/loadConfigFile.js') as any

const hyperlink = (url: string, title?: string) =>
  `\u001B]8;;${url}\u0007${title || url}\u001B]8;;\u0007`

fs.mkdir('dist/', { recursive: true }, () => null)

// Start web server
const server = http.createServer((request, response) => {
  return handler(request, response, {
    public: destDir,
  })
})
server.listen(port, () => {
  console.log(`Running webserver at ${hyperlink(`http://127.0.0.1:${port}`)}`)
})

// Create the userscript for development 'dist/dev.user.js'
const devScriptOutFile = path.join(destDir, devScriptInFile)
console.log(
  cyan(
    `generate development userscript ${bold('package.json')}, ${bold(
      'meta.json'
    )}, ${bold(devScriptInFile)} → ${bold(devScriptOutFile)}...`
  )
)
const devScriptContent = fs
  .readFileSync(devScriptInFile, 'utf8')
  .replace(/%PORT%/gm, port.toString())

const grants = 'grant' in meta ? meta.grant : []

if (!grants.includes('GM.xmlHttpRequest')) {
  grants.push('GM.xmlHttpRequest')
}
if (!grants.includes('GM.setValue')) {
  grants.push('GM.setValue')
}
if (!grants.includes('GM.getValue')) {
  grants.push('GM.getValue')
}
const devMetablock = metablock({
  file: './meta.json',
  override: {
    name: pkg.name + ' [dev]',
    version: pkg.version,
    description: pkg.description,
    homepage: pkg.homepage,
    author: pkg.author,
    license: pkg.license,
    grant: grants,
  },
} as any)

const result = devMetablock.renderChunk(devScriptContent, null, {
  sourcemap: false,
})
const outContent = typeof result === 'string' ? result : result.code
fs.writeFileSync(devScriptOutFile, outContent)
console.log(
  green(`created ${bold(devScriptOutFile)}. Please install in Tampermonkey: `) +
    hyperlink(`http://127.0.0.1:${port}/${devScriptInFile}`)
)

// eslint-disable-next-line promise/catch-or-return
loadConfigFile(path.resolve(__dirname, 'rollup.config.ts'), {
  configPlugin: 'typescript',
}).then(async ({ options }: { options: any }) => {
  // Start rollup watch
  const watcher = rollup.watch(options)

  watcher.on('event', (event) => {
    // eslint-disable-next-line default-case
    switch (event.code) {
      case 'BUNDLE_START': {
        console.log(
          cyan(
            `bundles ${bold(event.input as string)} → ${bold(
              event.output
                .map((fullPath) =>
                  path.relative(path.resolve(__dirname), fullPath)
                )
                .join(', ')
            )}...`
          )
        )

        break
      }
      case 'BUNDLE_END': {
        console.log(
          green(
            `created ${bold(
              event.output
                .map((fullPath) =>
                  path.relative(path.resolve(__dirname), fullPath)
                )
                .join(', ')
            )} in ${event.duration}ms`
          )
        )

        break
      }
      case 'ERROR': {
        console.log(bold(red('⚠ Error')))
        console.log(event.error)

        break
      }
      // No default
    }
    if ('result' in event && event.result) {
      event.result.close()
    }
  })

  // stop watching
  watcher.close()
})

export default {}
