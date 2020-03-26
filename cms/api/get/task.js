var dbconnect = require('../../../_core/dbOperations.js')
module.exports = {
    process: (req, res) => {
        return new Promise(async (resolve, reject) => {
            try {
                if (!req.user) {
                    reject({
                        "code": 404,
                        "message": "Not Authenticated"
                    })
                    return
                }
                var collections = await dbconnect.getDocument({
                    "collection": {
                        $or: [{
                            user: req.user.email
                        }, {
                            team: req.user.team
                        }]
                    },
                    "collectionName": global.config.db.collectionNames.task
                })
                if (collections.length == 0) {
                    resolve({
                        "code": 200,
                        "message": "There is no todo list associated to the user"
                    })
                    return
                }
                resolve({
                    "code": 200,
                    "message": "todo list are retrieved for the user",
                    "data": collections
                })
            } catch (err) {
                console.log(err)
                reject({
                    "code": 500,
                    "message": "Code execution failed"
                })
            }
        })
    }
}