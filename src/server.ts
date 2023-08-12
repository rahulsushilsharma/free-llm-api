import express from 'express';
import bodyParser from 'body-parser';
import { checkError, getRespomnces, isResponceComplete, messege, sleep } from './selenium.js';
import { parseGpt } from './parser.js';
import { saveOpenAiChat } from './database.js';

const app = express();
const port = 3000;

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// GET request handler
app.get('/', (req, res) => {
    res.send('Hello, Express server is up and running!');
});

// POST request handler
app.post('/chat', async (req, res) => {
    const requestData = req.body;
    console.log('Received POST data:', requestData);
    await messege(requestData.msg)
    await sleep(3000)
    try {
        const response = await responceLoop()

        saveOpenAiChat(requestData.msg, response)
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


async function responceLoop() {
    return new Promise<{
        user?: string;
        chat?: {
            text: string;
            code: string;
        }[];
    }[]>((resolve, reject) => {
        let id: string | null = null
        const responceLoopId = setInterval(async () => {

            let res = await getRespomnces()

            const resp = parseGpt(res)

            const resFlag = await isResponceComplete()
            const error = await checkError()
            if (error) { reject('Error genrating responce') }
            if (resFlag) {
                clearInterval(responceLoopId)
                const dbRes = await saveOpenAiChat(id, resp)
                if ('_id' in dbRes) id = dbRes._id
                resolve(resp)
            }
        }, 1000)
    })


}

export { startServer }