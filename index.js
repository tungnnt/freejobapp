const listTask = require('./api/list-task')
const login = require('./api/login')
const receiveTask = require('./api/receive-task')
const register = require('./api/register')
const submitTask = require('./api/submit-task')
const {
    randomString,
    randomName,
    randomCookie,
    randomPhone,
    randomIPHeader,
    randomDate,
    normalizeName,
    randomCSRF,
    randomFirstName,
    randomeBankNumber,
    randomUserAgent,
    randomIntegerAsString,
} = require('./helper/random')
require('./helper/createFolder')('data')

setImmediate(async () => {
    while (true) {
        try {
            let response

            const phone = randomPhone()

            const name = normalizeName(`${randomFirstName()} ${randomName()}`, ' ', false)

            const userAgent = randomUserAgent()

            console.log({
                phone, name, userAgent
            })

            response = await register(phone, name, userAgent)

            console.log(response.result)

            const token = response.cookies
                .filter(string => /token/.test(string))[0]
                .split(';')[0]

            response = await login(phone, userAgent)

            require('fs').appendFileSync('./data/accounts.txt', `${phone}\n`, () => { })

            console.log(response.result)

            const cookie = response.cookies
                .filter(string => {
                    if (/token/.test(string)) {
                        return string.split('; ')[0]
                    }
                    if (/__cookie_sz_yi_userid_4/.test(string)
                        || /member_mobile/.test(string)
                        || /openid=wap/.test(string)
                        || /PHPSESSID/.test(string)) {
                        return string
                    }
                }).join('; ') + `; ${token}`

            const { openid } = response.result

            console.log({ cookie, openid })

            const [taskID1, taskID2, taskID3] = ['467', '510', '508']

            response = await receiveTask(taskID1, openid, userAgent, cookie)

            console.log({ response })

            response = await receiveTask(taskID2, openid, userAgent, cookie)

            console.log({ response })

            response = await receiveTask(taskID3, openid, userAgent, cookie)

            console.log({ response })

            response = await listTask(openid, userAgent, cookie)

            const { list: taskList } = response.result

            const taskIDArray = taskList.map(task => ({
                id: task.id,
                type: /tiktok/gmi.test(task.link) ? 'tiktok' : 'instagram'
            }))

            console.log(taskIDArray)

            for (let i = 0; i < taskIDArray.length; i++) {
                const { id, type } = taskIDArray[i]

                const image = type === 'tiktok' ? '/4/2021/01/o36pQQQTWJfPpFJQ6Tq3j3WUnPU9JZ.png' : '/4/2021/01/G26Id2S2VdgVCPGN5CcId3vc2V8326.png'

                response = await submitTask(id, image, openid, cookie, userAgent)

                console.log(response)
            }
        } catch (error) {
            console.log(`ERROR: ${error}`)
        }
    }
})