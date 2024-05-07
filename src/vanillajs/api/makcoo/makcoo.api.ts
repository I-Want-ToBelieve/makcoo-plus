import { MAKCOO_API_URL } from '@/vanillajs/constant'

export const getStudents = async (
  { webviewToken, page, page_size, search_nick_name, school_id },
  prefix = MAKCOO_API_URL
) => {
  return fetch(
    `${prefix}/teacher/organization/get.stu-list?school_id=${school_id}&search_nick_name=${encodeURI(
      search_nick_name ?? ''
    )}&page_size=${page_size ?? 10}&page=${page ?? 1}&token=${webviewToken}`,
    {
      credentials: 'include',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (X11; Linux x86_64; rv:125.0) Gecko/20100101 Firefox/125.0',
        Accept: '*/*',
        'Accept-Language': 'en-US,en;q=0.5',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'cross-site',
      },
      referrer: 'https://www.makcoocode.com/',
      method: 'GET',
      mode: 'cors',
    }
  )
}
