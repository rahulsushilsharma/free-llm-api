import * as cheerio from 'cheerio';

function parseGpt(html: string | Buffer) {
    const $ = cheerio.load(html)
    let response: {
        user?: string
        chat?: string
    }[] = []

    $('.group').map((index, element) => {

        if ($(element).find('svg > text').text() != 'ChatGPT') {
            if ($(element).text().trim())
                response.push({
                    'user': $(element).find('.break-words').text().trim().replace('  ', '')
                })



        } else {
            let chat = ''
            const res = $(element).find('.markdown')[0] as cheerio.Element; // Use type assertion here
            if (!res) return chat = 'Openai is being a bitch... sovle the capta in browser and retry'
            // Loop through the child nodes
            for (const child of res.childNodes) {

                if (child.type === 'tag') { // Check if it's an element node

                    const childElement = child as cheerio.Element; // Use type assertion here

                    if (childElement.tagName === 'p') {

                        chat += $(childElement).text().trim() + '\n'

                    } else if (childElement.tagName === 'ol') {

                        $(childElement).find('li').map((index, element) => {

                            chat += index + '. ' + $(element).text().trim() + '\n'

                        })

                    }
                    else if (childElement.tagName === 'pre') {
                        chat += $(childElement).find('code').text().trim() + '\n'

                    }
                }
            }
            response.push({ chat: chat })

        }





    })
    return response
}

export { parseGpt }