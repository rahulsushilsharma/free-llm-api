import express from 'express';
import bodyParser from 'body-parser';
import { checkError, getRespomnces, isResponceComplete, messege, newChat, sleep } from './selenium.js';
import { parseGpt } from './parser.js';
import { saveNewOpenAiChat, updateOpenAiChat } from './database.js';

const app = express();
const port = 3000;
let openAiChatSessionId: string | null = null

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// GET request handler
app.get('/', (req, res) => {
    res.send('Hello, Express server is up and running!');
});

app.get('/new_chat', async (req, res) => {
    openAiChatSessionId = Date.now().toString()
    await saveNewOpenAiChat(openAiChatSessionId, {})
    await newChat()

    res.send({ message: 'New chat created' })
})

// POST request handler
app.post('/chat', async (req, res) => {
    const requestData = req.body;
    console.log('Received POST data:', requestData);
    await messege(requestData)
    await sleep(3000)
    try {
        const response = await responceLoop(1000)
        if (openAiChatSessionId == null) {
            openAiChatSessionId = Date.now().toString();
            const dbLog = await saveNewOpenAiChat(openAiChatSessionId, {})
            console.log("DB", dbLog);

        }
        const dbLog = await updateOpenAiChat(openAiChatSessionId, response)
        console.log("DB", dbLog);

        res.status(200).json({ message: 'Data received successfully', data: response.at(-1) });
    } catch (error) {

        res.status(400).json({ message: error });

    }
});





// Start the server


function startServer() {
    app.listen(port, () => {
        console.log(`Server is listening at http://localhost:${port}`);
    });

}


async function responceLoop(time: number) {
    return new Promise<{
        user?: string;
        chat?: {
            text: string;
            code: string;
        }[];
    }[]>((resolve, reject) => {
        const responceLoopId = setInterval(async () => {

            let res = await getRespomnces()

            const resp = parseGpt(res)

            const resFlag = await isResponceComplete()
            const error = await checkError()
            if (error) { reject('Error genrating responce') }
            if (resFlag) {
                clearInterval(responceLoopId)
                resolve(resp)
            }
        }, time)
    })


}

export { startServer }