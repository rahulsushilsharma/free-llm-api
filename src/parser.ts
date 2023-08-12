import * as cheerio from 'cheerio';

function parseGpt(html: string | Buffer) {
    const $ = cheerio.load(html)
    let response: {
        user?: string
        chat?: {
            text: string,
            code: string
        }[]
    }[] = []

    $('.group').map((index, element) => {

        if ($(element).find('svg > text').text() != 'ChatGPT') {
            if ($(element).text().trim())
                response.push({
                    'user': $(element).find('.break-words').text().trim().replace('  ', '')
                })

        } else {
            let chatDataarr: {
                text: string,
                code: string
            }[] = []
            const res = $(element).find('.markdown')[0] as cheerio.Element; // Use type assertion here
            if (!res) return chatDataarr[0]['text'] = 'Sovle the capta in browser and retry...'
            // Loop through the child nodes
            for (const child of res.childNodes) {
                let chat = ''

                let chatData: any = {
                    text: '',
                    code: ''
                }
                if (child.type === 'tag') { // Check if it's an element node

                    const childElement = child as cheerio.Element; // Use type assertion here

                    if (childElement.tagName === 'p') {

                        chat += $(childElement).text().replace(/\n\s+/g, ' ') + '\n'
                        chatData['text'] = chat

                    } else if (childElement.tagName === 'ol') {

                        $(childElement).find('li').map((index, element) => {

                            chat += index + 1 + '. ' + $(element).text().replace(/\n\s+/g, ' ') + '\n'


                        })
                        chatData['text'] = chat

                    }
                    else if (childElement.tagName === 'pre') {
                        chat += '\n```\n' + $(childElement).find('code').text()
                        chat += '\n```\n'
                        chatData['code'] = chat

                    }
                    chatDataarr.push(chatData)
                }

            }
            response.push({ chat: chatDataarr })

        }





    })
    return response
}

export { parseGpt }