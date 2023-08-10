import * as cheerio from 'cheerio';
// import { writeFile, readFile } from 'fs'

// readFile('result.html', (err, data) => {
//     const $ = cheerio.load(data)
//     $('.group').map((index, element) => {
//         if ($(element).find('title').text() != 'ChatGPT') {
//             if ($(element).text().trim())
//                 console.log('User', $(element).find('.break-words').text().trim().replace('  ', ''))

//         } else {
//             console.log('Assistent')

//             const res = $(element).find('.markdown')[0] as cheerio.Element; // Use type assertion here

//             // Loop through the child nodes
//             for (const child of res.childNodes) {
//                 if (child.type === 'tag') { // Check if it's an element node
//                     const childElement = child as cheerio.Element; // Use type assertion here
//                     if (childElement.tagName === 'p') {
//                         console.log('data ===> ', $(childElement).text().trim());
//                     } else if (childElement.tagName === 'pre') {
//                         console.log('code ===> ', $(childElement).find('code').text().trim());
//                     }
//                 }
//             }
//             // const pra = $(element).find('p')
//             // const code = $(element).find('code')

//             // for(const p in pra){
//             //     console.log($(p).text().replace('\t','').replace(' ','').trim()|| null)
//             // }
//             // for(const p in code){
//             //     console.log($(p).text().replace('\t','').replace(' ','').trim()||null)
//             // }
//         }
//     })
// })


function parseGpt(html: string) {
    const $ = cheerio.load(html)
    const response = {
        user: '',
        chat: ''
    }
    $('.group').map((index, element) => {
        if ($(element).find('title').text() != 'ChatGPT') {
            if ($(element).text().trim())
                response.user = $(element).find('.break-words').text().trim().replace('  ', '')
            // console.log('User', )

        } else {
            console.log('Assistent')

            const res = $(element).find('.markdown')[0] as cheerio.Element; // Use type assertion here
            if(!res) return response.chat = 'Openai is being a bitch... sovle the capta in browser and retry'
            // Loop through the child nodes
            for (const child of res.childNodes) {
                if (child.type === 'tag') { // Check if it's an element node
                    const childElement = child as cheerio.Element; // Use type assertion here
                    if (childElement.tagName === 'p') {
                        response.chat += $(childElement).text().trim() + '\n'
                        // console.log('data ===> ', );
                    } else if (childElement.tagName === 'ol') {
                        $(childElement).find('li').map((index, element) => {
                            response.chat += index + '. ' + $(element).text().trim() + '\n'

                            // console.log(index, $(element).text().trim());
                        })

                    }
                    else if (childElement.tagName === 'pre') {
                        response.chat += $(childElement).find('code').text().trim() + '\n'

                        // console.log('code ===> ', );
                    }
                }
            }
        }
    })
    return response
}

export { parseGpt }