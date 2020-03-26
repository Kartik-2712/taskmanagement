const MongoClient = require('mongodb').MongoClient;
var operations = {
    /**
     * generic function to insert a new document in a collection
     * @param.collectionName - name of the collection
     * @param.collection - details of the collection
     * @returns Promise
     */
    insertDocument: (param) => {
        return new Promise(async (resolve, reject) => {
            try {
                var client = await MongoClient.connect(process.env.DBSERVER)
                client.db(global.config.db.name).collection(param.collectionName).insertOne(param.collection)
                resolve()
            } catch (err) {
                console.log(err)
                reject(err)
            }
        })
    },
    /**
     * generic function to get a single or all document in a collection
     * @param.collectionName - name of the collection
     * @param.collection - details of the collection to find
     * @returns Promise
     */
    getDocument: (param) => {
        return new Promise(async (resolve, reject) => {
            try {
                var client = await MongoClient.connect(process.env.DBSERVER)
                var collections = await client.db(global.config.db.name).collection(param.collectionName).find(param.collection).toArray()
                client.close()
                resolve(collections)
            } catch (err) {
                console.log(err)
                reject(err)
            }
        })
    },
    /**
     * generic function to update a document in a collection
     * @param.collectionName - name of the collection
     * @param.collection - details of the collection
     * @param.updatesCollection - updated details of the collection
     * @returns Promise
     */
    updateDocument: (param) => {
        return new Promise(async (resolve, reject) => {
            try {
                var client = await MongoClient.connect(process.env.DBSERVER)
                client.db(global.config.db.name).collection(param.collectionName).updateOne(param.collection, param.updatesCollection)
                client.close()
                resolve()
            } catch (err) {
                console.log(err)
                reject(err)
            }
        })
    },
    /**
     * generic function to dekete a single document in a collection
     * @param.collectionName - name of the collection
     * @param.collection - details of the collection to delete
     * @returns Promise
     */

    deleteDocument: (param) => {
        return new Promise(async (resolve, reject) => {
            try {
                var client = await MongoClient.connect(process.env.DBSERVER)
                client.db(global.config.db.name).collection(param.collectionName).deleteOne(param.collection)
                client.close()
                resolve()
            } catch (err) {
                console.log(err)
                reject(err)
            }
        })
    }
}
module.exports = operations;