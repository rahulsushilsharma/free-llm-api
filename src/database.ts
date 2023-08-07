import Datastore from '@seald-io/nedb'

const db = new Datastore({ filename: './database/openAi.db' })
try {
    
  await db.loadDatabaseAsync()
} catch (error) {
  // loading has failed
}

