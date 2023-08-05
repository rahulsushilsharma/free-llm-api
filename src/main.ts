import 'dotenv/config';
import { loginToOpenAi, seleniumInit } from './selenium.js';

console.log(process.env.OPENAI_ID)
console.log(process.env.OPENAI_PASSWORD)

const id = process.env.OPENAI_ID || ""
const pass = process.env.OPENAI_PASSWORD || ""

async function main() {
    await seleniumInit()
    await loginToOpenAi(id,pass)
}
main()