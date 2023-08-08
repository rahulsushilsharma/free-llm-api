import 'dotenv/config';
import { parseGpt } from './parser.js';
import { extitSelenium, getRespomnces, getUserSessionfromBrowsern, gotoPage, isResponceComplete, loadSession, loginToOpenAi, messege, seleniumInit, skipIntro, sleep } from './selenium.js';
import { getUserSession, initilizeDb, saveUserSession } from './database.js';




const id = process.env.OPENAI_ID || ""
const pass = process.env.OPENAI_PASSWORD || ""

async function main() {
    await seleniumInit()
    await initilizeDb()
    await gotoPage('https://chat.openai.com/auth/login')
    const prevSession = await checkPrevousSession('GPT')
    console.log(prevSession);
    
    if (!prevSession) {
        await loginToOpenAi(id, pass)
        await skipIntro()
        await saveCurrentSession('GPT')
    }

    await messege("basic history of the USA")
    await responceLoop()
    await messege("basic history of the UN")
    await responceLoop()




}

async function checkPrevousSession(vendor: string) {
    const session = await getUserSession(vendor)
    console.log(session)

    if (session.length == 0) return false;

    await loadSession(session[0].data)
    return true
}

async function saveCurrentSession(vendor: string) {
    const session = await getUserSessionfromBrowsern()
    await saveUserSession(vendor, session)
}

async function responceLoop() {
    return new Promise((resolve) => {
        const responceLoopId = setInterval(async () => {
            let res = await getRespomnces()
            parseGpt(res)
            const resFlag = await isResponceComplete()
            if (resFlag) {
                clearInterval(responceLoopId)
                resolve(responceLoopId)
            }
        }, 1000)
    })


}



main()