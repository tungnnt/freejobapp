const axios = require('axios')
const FormData = require('form-data')
const https = require('https')
const agent = new https.Agent({
    rejectUnauthorized: false
})

module.exports = async (openID, userAgent, cookie) => {
    let data = new FormData()

    data.append('page', '1')

    data.append('status', '0')

    data.append('grade', '1')

    data.append('openid', openID)

    data.append('lang', 'en')

    const config = {
        method: 'post',
        url: 'https://app.freejobsapp.com/app/index.php?i=4&c=entry&do=apis&m=sz_yi&p=userinfo&op=my_task_list',
        headers: {
            'authority': 'app.freejobsapp.com',
            'accept': 'application/json, text/plain, */*',
            'user-agent': userAgent,
            'origin': 'https://app.freejobsapp.com',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'referer': 'https://app.freejobsapp.com/dist/',
            'accept-language': 'en-US,en;q=0.9',
            'cookie': cookie,
            'Accept': 'application/json, text/plain, */*',
            ...data.getHeaders()
        },
        data: data,
        httpsAgent: agent
    }

    const response = await axios(config)

    return response.data
}