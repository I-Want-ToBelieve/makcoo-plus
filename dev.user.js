/* eslint-disable promise/no-nesting */
/* eslint-disable no-undef */
/**  globals GM */

'use strict'
;(function () {
  const url = `http://localhost:%PORT%/bundle.user.js?${Date.now()}`
  new Promise(function loadBundleFromServer(resolve, reject) {
    const req = GM.xmlHttpRequest({
      method: 'GET',
      url: url,
      onload: function (r) {
        if (r.status !== 200) {
          reject(r)
          return
        }
        resolve(r.responseText)
      },
      onerror: (e) => reject(e),
    })
    if (req && 'catch' in req) {
      req.catch((err) => {
        /* ignore */
      })
    }
  })
    .catch(function (err) {
      const log = function (obj, b) {
        let prefix = 'loadBundleFromServer: '
        try {
          prefix = GM.info.script.name + ': '
        } catch {}
        if (b) {
          console.log(prefix + obj, b)
        } else {
          console.log(prefix, obj)
        }
      }
      if (err && 'status' in err) {
        if (err.status <= 0) {
          log('Server is not responding')
          void GM.getValue('scriptlastsource3948218', false).then(function (
            src
          ) {
            if (src) {
              log(
                '%cExecuting cached script version',
                'color: Crimson; font-size:x-large;'
              )
              /* eslint-disable no-eval */
              eval(src)
            }
          })
        } else {
          log('HTTP status: ' + err.status)
        }
      } else {
        log(err)
      }
    })
    .then(function (s) {
      if (s) {
        /* eslint-disable no-eval */
        eval(`${s} //# sourceURL=${url}`)
        GM.setValue('scriptlastsource3948218', s)
      }
    })
    .finally(() => void 0)
})()
