import 'dotenv/config';
import { parseGpt } from './parser.js';
import { extitSelenium, getRespomnces, isResponceComplete, loginToOpenAi, messege, seleniumInit, skipIntro, sleep } from './selenium.js';


console.log(process.env.OPENAI_ID)
console.log(process.env.OPENAI_PASSWORD)

const id = process.env.OPENAI_ID || ""
const pass = process.env.OPENAI_PASSWORD || ""

async function main() {
    await seleniumInit()
    await loginToOpenAi(id, pass)
    await skipIntro()
    await messege("basic history of the USA")
    await responceLoop()
    await messege("basic history of the UN")
    await responceLoop()

    

    // await extitSelenium()

}

async function responceLoop() {
    return new Promise((resolve)=>{
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