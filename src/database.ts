import Datastore from '@seald-io/nedb'

const openAiDb = new Datastore({ filename: './database/openAi.db' })
const userSessionDb = new Datastore({ filename: './database/userSession.db' })


async function initilizeDb() {
    try {
        console.log('initializing Database...')
        await userSessionDb.loadDatabaseAsync()
        await openAiDb.loadDatabaseAsync()
        return true;

    } catch (error) {
        // loading has failed
        console.error(' Database failed to initialize...', error)
        return false;
    }

}


async function saveUserSession(vendor: string, data: any) {
    await userSessionDb.insertAsync({
        vendor, data
    })
}

async function getUserSession(vendor: string) {
    return await userSessionDb.findAsync({ vendor })
}

async function updateOpenAiChat(id: string | null, data: any) {

    return await openAiDb.updateAsync({ date: id }, { $set: { data: data } })

}

async function saveNewOpenAiChat(id: string | null, data: any) {
    return await openAiDb.insertAsync({
        vendor: 'GPT-3.5',
        data: data,
        date: id
    })
}

async function getOpenAiChat(session: string) {
    return await openAiDb.findAsync({  })
}

// await initilizeDb()
// const data:any =await openAiDb.findAsync({})
// console.log(data[1].data)
// await saveUserSession('Gpt','session')
// const session = await getUserSession('Gpt')
// console.log('session',session)

export { saveUserSession, getUserSession, initilizeDb, saveNewOpenAiChat, getOpenAiChat, updateOpenAiChat }