var dbconnect = require('../../../_core/dbOperations.js')
var schedule = require('../../../_core/scheduler')
/**
 * Remove Task Functionality
 * Removes the task and stops the schedule of the task
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
                await dbconnect.deleteDocument({
                    "collection": {
                        "taskid": parseInt(req.params.id)
                    },
                    "collectionName": global.config.db.collectionNames.task
                })
                await schedule.removeJobs({
                    "taskid": req.params.id
                })
                resolve({
                    "code": 200,
                    "message": "task has been deleted"
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