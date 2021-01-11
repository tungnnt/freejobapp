const fs = require('fs')
    , es = require('event-stream')
const ACCOUNTS_FILE = './data/accounts1.txt'
const ERROR_FILE = './data/errors.txt'
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

const _defineTaskType = link => {
    if (/tiktok/gmi.test(link)) {
        return 'tiktok'
    }

    if (/facebook/gmi.test(link)) {
        return 'facebook'
    }

    if (/instagram/gmi.test(link)) {
        return 'instagram'
    }
}

const TASK_IMAGE = {
    'tiktok': '/4/2021/01/o36pQQQTWJfPpFJQ6Tq3j3WUnPU9JZ.png',
    'instagram': '/4/2021/01/G26Id2S2VdgVCPGN5CcId3vc2V8326.png',
    'facebook': '/4/2021/01/L6Khxw794r47K76WZ709Rg7o7h9EU7.png'
}

setImmediate(async () => {
    const s = fs.createReadStream(ACCOUNTS_FILE)
        .pipe(es.split())
        .pipe(es.mapSync(async line => {
            s.pause()

            try {
                const phone = line.trim()

                console.log({ phone })

                const userAgent = randomUserAgent()

                response = await login(phone, userAgent)

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
                    }).join('; ')

                const { openid } = response.result

                console.log({ cookie, openid })

                // const [taskID1, taskID2, taskID3] = ['467', '510', '508']

                const [taskID1, taskID2, taskID3] = ['515', '514', '512']

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
                    type: _defineTaskType(task.link)
                }))

                console.log(taskIDArray)

                for (let i = 0; i < taskIDArray.length; i++) {
                    const { id, type } = taskIDArray[i]

                    const image = TASK_IMAGE[`${type}`]

                    response = await submitTask(id, image, openid, cookie, userAgent)

                    console.log(response)
                }

                s.resume()
            } catch (e) {
                // fs.appendFile(ERROR_FILE, JSON.stringify({ err: e, data: line }) + '\n', () => { })

                s.resume()
            }
        }).on('error', function (err) {

        }).on('end', function () {

        }))
})