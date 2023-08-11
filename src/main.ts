import 'dotenv/config';
import { getUserSessionfromBrowsern, gotoPage, loadSession, loginToOpenAi, seleniumInit, skipIntro } from './selenium.js';
import { getUserSession, initilizeDb, saveUserSession } from './database.js';
import { startServer } from './server.js';


const id = process.env.OPENAI_ID || ""
const pass = process.env.OPENAI_PASSWORD || ""
const profilePath = process.env.CHROME_PROFILE_PATH || ""
const profileName = process.env.CHROME_PROFILE_NAME || ""

async function main() {
    await seleniumInit(profilePath,profileName)
    await initilizeDb()
    await gotoPage('https://chat.openai.com/')
    try{
    await loginToOpenAi(id, pass)
    await skipIntro()
    }catch{
        console.log('already logged in.')
    }
    startServer()

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



main()