/* eslint-disable complexity */
// export const run = () => {
//   const uw = unsafeWindow as typeof window
//   uw.console.log('hello i am vanillajs')
//   // 获取目标元素（这里使用了 class 名称来获取第一个匹配的元素）
//   const target: Node | null = document.body

//   // 创建 MutationObserver 实例
//   const observer = new MutationObserver((records) => {
//     for (const record of records) {
//       const { addedNodes, removedNodes, type } = record
//       // 在这里处理状况变化
//       console.log('aaa', type)
//       if (!['childList'].includes(type)) return

//       const addedNode = addedNodes[0] as Element
//       console.log('bbb', addedNode.nodeType)
//       if (addedNode.nodeType !== Node.ELEMENT_NODE) return

//       console.log('ccc', addedNode)
//       if (!addedNode) return

//       console.log('ddd', addedNode.classList)
//       if (Array.from(addedNode.classList).includes('video-mark')) {
//         console.log('DOM树结构发生变化了', Array.from(addedNode.classList))

//         document.getElementById('control-fullscreen')?.click()
//       }
//     }
//   })

//   // 配置监测选项
//   const options = { attributes: false, subtree: true, childList: true }

//   // 开始监测
//   observer.observe(target, options)
//   console.log('vanillajs end')
// }
import dayjs from 'dayjs'

import { getStudents } from './api/makcoo/makcoo.api'
import { getCurrentTeacherTimetableGroups } from './api/xiaomai/xiaomai.api'
import { MAKCOO_PLUS_STORE_KEY } from './constant'

const defaultStore = {
  xiaomai: {
    currentTeacher: {
      uid: '',
      id: '',
      name: '',
      token: '',
      version: '',
      xmVersion: '',
      instId: '',
    },
    allTeachers: [],
  },
  makcoo: {
    AllStudents: [],
    webviewToken: '',
    schoolId: 521,
  },
}
export const getCurrentWeek = () => {
  const startOfWeek = dayjs().isoWeekday(1).format('YYYY-MM-DD') + ' 00:00:00'
  const endOfWeek = dayjs().isoWeekday(7).format('YYYY-MM-DD') + ' 23:59:59'
  return { startOfWeek, endOfWeek }
}
export const isXiaoMai = window.location.origin === 'https://b.xiaomai5.com'
export const isMakcooCode =
  window.location.origin === 'https://www.makcoocode.com'

export const initStore = async () => {
  if (isXiaoMai) {
    const savedStore: typeof defaultStore = await GM.getValue(
      MAKCOO_PLUS_STORE_KEY,
      defaultStore
    )
    const currentTeacher = savedStore.xiaomai.currentTeacher
    const tid = localStorage.getItem('w_tid') ?? currentTeacher.id

    const tname = localStorage.getItem('w_tname') ?? currentTeacher.name
    const version = localStorage.getItem('version') ?? currentTeacher.version
    const token = localStorage.getItem('token') ?? currentTeacher.token
    const uid = localStorage.getItem('uid') ?? currentTeacher.uid
    const xmVersion =
      localStorage.getItem('xmVserion') ?? currentTeacher.xmVersion
    const instId = localStorage.getItem('instId') ?? currentTeacher.instId
    const store = {
      ...savedStore,
      xiaomai: {
        ...savedStore.xiaomai,
        currentTeacher: {
          uid,
          id: tid,
          name: tname,
          token,
          version,
          xmVersion,
          instId,
        },
      },
    }

    await GM.setValue(MAKCOO_PLUS_STORE_KEY, store)
  }

  if (isMakcooCode) {
    const savedStore: typeof defaultStore = await GM.getValue(
      MAKCOO_PLUS_STORE_KEY,
      defaultStore
    )

    const webviewToken =
      localStorage.getItem('webviewToken') ?? savedStore.makcoo.webviewToken

    const store: typeof defaultStore = {
      ...savedStore,
      makcoo: {
        ...savedStore.makcoo,
        webviewToken,
      },
    }

    await GM.setValue(MAKCOO_PLUS_STORE_KEY, store)
  }

  return GM.getValue(MAKCOO_PLUS_STORE_KEY, defaultStore)
}

export const main = async () => {
  console.log('hello', window.location.origin, isXiaoMai, isMakcooCode)
  // console.log(ajaxHooker.filter)

  const store: typeof defaultStore = await initStore()

  console.log('store', store)

  if (isXiaoMai) {
    const currentTeacherTimetableGroups =
      await getCurrentTeacherTimetableGroups(store.xiaomai.currentTeacher)

    console.log(
      'OOOOOOMMMMMMMMMGGGGGGGGG',
      await currentTeacherTimetableGroups.json()
    )

    ajaxHooker.hook((request) => {
      if (
        request.url.includes(
          'gateway.xiaomai5.com/business/public/timetable/inst/card'
        )
      ) {
        request.response = (response) => {
          console.log(
            'p business/public/timetable/inst/card',
            JSON.parse(response.responseText)
          )
        }
      }

      if (
        request.url.includes(
          'gateway.xiaomai5.com/business/public/teacher/getTeacherDigestPage'
        )
      ) {
        request.response = (response) => {
          const data = JSON.parse(response.responseText)

          if (data?.result?.records) {
            GM.setValue(MAKCOO_PLUS_STORE_KEY, {
              ...store,
              xiaomai: {
                ...store.xiaomai,
                allTeacher: data.result.records,
              },
            })
          }

          console.log('p business/public/teacher/getTeacherDigestPag', data)
        }
      }
    })
  } else if (isMakcooCode) {
    // 试图添加学生到班级中并且试图搜索学生
    ajaxHooker.hook((request) => {
      if (
        request.url.includes(
          'api.bellcode.com/teacher/organization/get.stu-list'
        )
      ) {
        const searchParams = new URLSearchParams(request.data)

        const search_nick_name = searchParams.get('search_nick_name')
        if (search_nick_name?.includes(',')) {
          const names = search_nick_name.split(',')

          request.response = async (response) => {
            const json = response.json // 注意保存原数据
            console.log(
              'p api.bellcode.com/teacher/organization/get.stu-list',
              response,
              json
            )

            const result = await Promise.all(
              names.map(async (name) => {
                return (
                  await getStudents({
                    webviewToken: store.makcoo.webviewToken,
                    school_id: store.makcoo.schoolId ?? 521,
                    search_nick_name: name,
                  })
                ).json()
              })
            )

            const list = result
              .reduce((acc, it) => acc.concat(it.data.list), [])
              .filter((it) => names.includes(it.nick_name))

            console.log('result', list)

            // eslint-disable-next-line require-atomic-updates
            response.response = new Promise((resolve) => {
              resolve(
                `{
                  "code": 200,
                  "message": "",
                  "data": {
                      "list": ${JSON.stringify(list)},
                      "page": 1,
                      "pagesize": 10,
                      "page_size": 10,
                      "total": ${list.length}
                  }
                }`
              )
            })
          }
        }
      }
    })
  }

  console.log('hello end')
}
