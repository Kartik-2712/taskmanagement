var dbconnect = require('../../../_core/dbOperations.js')
var schedule = require('../../../_core/scheduler')
/**
 * Update Task functionality
 * updates the task and reschedules the mail
 */
module.exports = {
    process: (req, res) => {
        return new Promise(async (resolve, reject) => {
            try {
                if (!req.body || !req.params.id) {
                    reject({
                        "code": "200",
                        "message": "Required details are not provided"
                    })
                    return
                }
                let updatedCollectionObject = {
                    "$set": {
                        "name": req.body.name,
                        "dateandtime": req.body.datetime,
                        "user": req.body.user,
                        "team": req.body.team,
                        "updated_at": +new Date()
                    }
                }
                await dbconnect.updateDocument({
                    "collection": {
                        "taskid": parseInt(req.params.id)
                    },
                    "updatesCollection": updatedCollectionObject,
                    "collectionName": global.config.db.collectionNames.task
                })
                schedule.startJob({
                    "name": req.body.name,
                    "dateandtime": req.body.datetime,
                    "user": req.body.user,
                    "team": req.body.team,
                    "taskid": parseInt(req.params.id)
                })
                resolve({
                    "code": 200,
                    "message": "task has been updated"
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