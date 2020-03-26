var dbconnect = require('../../../_core/dbOperations.js')
var schedule = require('../../../_core/scheduler')
/**
 * Add New Todo/Task Functionality
 * Adds new task and schedules mail for the task
 * @param req.body should contain the following details
    "name": "",
    "dateandtime": "",
    "user": "",
    "team": ""
 */

module.exports = {
    process: (req, res) => {
        return new Promise(async (resolve, reject) => {
            try {
                if (!req.body || !req.body.name || !req.body.datetime || (!req.body.team && !req.body.user)) {
                    reject({
                        "code": "200",
                        "message": "Required details are not provided"
                    })
                    return
                }
                if (+new Date() >= +new Date(req.body.datetime)) {
                    reject({
                        "code": "500",
                        "message": "Task time should be less than current time",
                    })
                    return
                }
                var tasks = await dbconnect.getDocument({
                    "collection": {},
                    "collectionName": global.config.db.collectionNames.task
                })
                let taskid = (tasks.length == 0) ? 1 : tasks[tasks.length - 1].taskid + 1
                await dbconnect.insertDocument({
                    "collection": {
                        "name": req.body.name,
                        "dateandtime": req.body.datetime,
                        "user": req.body.user,
                        "created_at": +new Date(),
                        "team": req.body.team,
                        "taskid": taskid
                    },
                    "collectionName": global.config.db.collectionNames.task
                })
                await schedule.startJob({
                        "name": req.body.name,
                        "dateandtime": req.body.datetime,
                        "user": req.body.user,
                        "team": req.body.team,
                        "taskid": taskid
                })
                resolve({
                    "code": 200,
                    "message": "task has been created"
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