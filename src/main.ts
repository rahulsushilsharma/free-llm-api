import 'dotenv/config';
import { extitSelenium, loginToOpenAi, messege, seleniumInit, skipIntro } from './selenium.js';

console.log(process.env.OPENAI_ID)
console.log(process.env.OPENAI_PASSWORD)

const id = process.env.OPENAI_ID || ""
const pass = process.env.OPENAI_PASSWORD || ""

async function main() {
    await seleniumInit()
    await loginToOpenAi(id,pass)
    await skipIntro()
    await messege("hi")
    // await extitSelenium()
}
main()