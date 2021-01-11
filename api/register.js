const axios = require('axios')
const FormData = require('form-data')
const https = require('https')
const agent = new https.Agent({
    rejectUnauthorized: false
})

module.exports = async (phone, name, userAgent, ref = '821953', password = 'Pa55w0rds') => {
    let data = new FormData()

    data.append('mobile', phone)

    data.append('password', password)

    data.append('password1', password)

    data.append('nickname', name)

    data.append('code', '')

    data.append('incode', ref)

    data.append('lang', 'en')

    const config = {
        method: 'post',
        url: 'https://app.freejobsapp.com/app/index.php?i=4&c=entry&do=apis&m=sz_yi&p=userinfo&op=register',
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
            ...data.getHeaders()
        },
        data: data,
        httpsAgent: agent
    }

    const response = await axios(config)

    const cookies = response.headers['set-cookie']

    return {
        ...response.data,
        cookies,
    }
}