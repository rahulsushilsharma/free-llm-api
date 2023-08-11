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

async function saveOpenAiChat(id: string|null, data: any) {
    if (id !== null) {
        return await openAiDb.updateAsync({ _id: id }, { $set: { data: data }})
    } else {
        return await openAiDb.insertAsync({
            vendor:'GPT-3.5',
            data: data,
            date: Date.now()
        })
    }
}
async function getOpenAiChat(session: string) {
    return await openAiDb.findAsync({ id: session })
}

// await initilizeDb()
// const data =await openAiDb.findAsync({})
// console.log(data)
// await saveUserSession('Gpt','session')
// const session = await getUserSession('Gpt')
// console.log('session',session)

export { saveUserSession, getUserSession, initilizeDb, saveOpenAiChat, getOpenAiChat }