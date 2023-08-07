import 'dotenv/config';
import { parseGpt } from './parser.js';
import { extitSelenium, getRespomnces, loginToOpenAi, messege, seleniumInit, skipIntro, sleep } from './selenium.js';


console.log(process.env.OPENAI_ID)
console.log(process.env.OPENAI_PASSWORD)

const id = process.env.OPENAI_ID || ""
const pass = process.env.OPENAI_PASSWORD || ""

async function main() {
    await seleniumInit()
    await loginToOpenAi(id, pass)
    await skipIntro()
    await responceLoop()
    await messege("hi")
    sleep(1000)
    await messege("hi")


    // await extitSelenium()

}

async function responceLoop() {
    setInterval(async () => {
        let res = await getRespomnces()
        parseGpt(res)
    }, 1000)

}


main()