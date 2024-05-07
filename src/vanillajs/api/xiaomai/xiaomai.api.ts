import { XIAOMAI_API_URL } from '@/vanillajs/constant'

export const getCurrentTeacherTimetableGroups = async (
  { version, token, uid, id, xmVersion, instId, name },
  prefix = XIAOMAI_API_URL
) => {
  return fetch(
    `${prefix}/public/timetable/inst/card?p=w&v=${version}&userType=B&token=${token}&uid=${uid}&tid=${id}&aid=${id}`,
    {
      credentials: 'omit',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (X11; Linux x86_64; rv:124.0) Gecko/20100101 Firefox/124.0',
        Accept: 'application/json, text/javascript, */*; q=0.01',
        'Accept-Language': 'en-US,en;q=0.5',
        'Content-Type': 'application/json; charset=UTF-8',
        originPath: 'https://b.xiaomai5.com/index.html#/plan/time_schedule',
        userId: uid,
        xmrule: 'latest',
        userType: 'B',
        p: 'w',
        deviceType: 'w',
        bizAccountId: id,
        uid: uid,
        tid: id,
        token: token,
        xmToken: token,
        vn: '5.7.0',
        project: 'xmzj-web-b',
        xmVersion: xmVersion,
        v: version,
        instId: instId,
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-site',
        cid: '',
        orgAdminId: '',
      },
      referrer: 'https://b.xiaomai5.com/',
      body: `{"beginTime":${dayjs().valueOf()},"teacherIds":["${id}"],"courseNames":[],"className":[],"courseIds":[],"classIds":[],"teacherName":["${name}"],"classRoomIds":[],"classRoomName":[],"onlyReserve":false,"extraStuTypes":[],"studentId":"","startDate":${dayjs(
        getCurrentWeek().startOfWeek
      ).valueOf()},"endDate":${
        dayjs(getCurrentWeek().endOfWeek).valueOf() - 999
      },"needFilterByRange":true,"timetableType":1,"isFilterHoliday":true,"needStuCountInfo":true,"needSignInfo":true,"scheduleRange":"ALL"}`,
      method: 'POST',
      mode: 'cors',
    }
  )
}
