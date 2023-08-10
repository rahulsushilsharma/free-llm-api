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

async function saveOpenAiChat(sessionName: string, data: any) {
    try {
        await userSessionDb.updateAsync({ id: sessionName }, { data: data })
    } catch {
        await userSessionDb.insertAsync({
            id: sessionName,
            data: data,
            date: Date.now()
        })
    }
}
async function getOpenAiChat(session: string) {
    return await userSessionDb.findAsync({ id: session })
}

// await initilizeDb()
// await saveUserSession('Gpt','session')
// const session = await getUserSession('Gpt')
// console.log('session',session)

export { saveUserSession, getUserSession, initilizeDb, saveOpenAiChat, getOpenAiChat }