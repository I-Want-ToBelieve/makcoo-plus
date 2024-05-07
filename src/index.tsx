import dayjs from 'dayjs'
import isoWeek from 'dayjs/plugin/isoWeek'

import 'dayjs/locale/zh-cn'

import createApp from './App'
import { main } from './vanillajs'

dayjs.extend(isoWeek)
dayjs.locale('zh-cn')

document.addEventListener('DOMContentLoaded', (event) => {
  createApp()
})

main()
