import express from 'express';
import bodyParser from 'body-parser';
import { getRespomnces, isResponceComplete, messege, sleep } from './selenium.js';
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
    const response = await responceLoop()
    saveOpenAiChat(requestData.msg, response)
    res.status(200).json({ message: 'Data received successfully', data: response });
});

// Start the server


function startServer() {
    app.listen(port, () => {
        console.log(`Server is listening at http://localhost:${port}`);
    });

}


async function responceLoop() {
    return new Promise<{
        user: string;
        chat: string;
    }[]>((resolve) => {
        const responceLoopId = setInterval(async () => {

            let res = await getRespomnces()

            const resp = parseGpt(res)
            console.log(resp);

            const resFlag = await isResponceComplete()
            if (resFlag) {
                clearInterval(responceLoopId)
                resolve(resp)
            }
        }, 1000)
    })


}

export { startServer }