import 'dotenv/config';
import { parseGpt } from './parser.js';
import { extitSelenium, getRespomnces, getUserSessionfromBrowsern, gotoPage, isResponceComplete, loadSession, loginToOpenAi, messege, seleniumInit, skipIntro, sleep } from './selenium.js';
import { getUserSession, initilizeDb, saveUserSession } from './database.js';
import { startServer } from './server.js';
// app.post('/', (req, res) => {
//     res.send('Got a POST request')
//   })




const id = process.env.OPENAI_ID || ""
const pass = process.env.OPENAI_PASSWORD || ""
const profilePath = process.env.CHROME_PROFILE_PATH || ""
const profileName = process.env.CHROME_PROFILE_NAME || ""

async function main() {
    await seleniumInit(profilePath,profileName)
    await initilizeDb()
    await gotoPage('https://chat.openai.com')
    try{
    await loginToOpenAi(id, pass)
    await skipIntro()
    }catch{
        console.log('already logged in.')
    }
    startServer()
    // await msgLoop()







}

// async function msgLoop() {
//     while (1) {
//         inquirer
//             .prompt([
//                 /* Pass your questions in here */
//                 'Ask Question: '
//             ])
//             .then( async (answers) => {
//                 // Use user feedback for... whatever!!
//                 await messege(answers)
//         await responceLoop()
//             })
//             .catch((error) => {
//                 if (error.isTtyError) {
//                     // Prompt couldn't be rendered in the current environment
//                 } else {
//                     // Something else went wrong
//                 }
//             });


//     }
// }

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