var cron = require('node-cron');
var moment = require('moment')
var dbconnect = require('./dbOperations')
var nodemailer = require('nodemailer')
var schedulelist = {}

var scheduleOperations = {
    /**
     * function to start the cron job for a task
     * If cronjob for the particular job is already there it will stopped and updated or else new one will be created
     * @param.task - task details Object
     */
    startJob: async (task) => {
        if (schedulelist[task.taskid]) {
            schedulelist[task.taskid].stop()
        }
        let timeformat = moment(task.dateandtime).format('ss mm HH DD MM *')
        if (task.email) {
            task.to = task.email
        } else {
            var teammembers = await dbconnect.getDocument({
                "collection": {
                    "team": task.team
                },
                "collectionName": global.config.db.collectionNames.user
            })
            task.to = teammembers.reduce(function (previous, current) {
                return previous.email + ',' + current.email
            })
        }
        schedulelist[task.taskid] = cron.schedule(timeformat, function () {
            console.log('started')
            scheduleOperations.completeTasks(task)
        });
        schedulelist[task.taskid].start();
        return
    },
    /**
     * function to stop the cron job
     * @param.task.taskid - id of the task
     */
    removeJobs: (task) => {
        if (schedulelist[parseInt(task.taskid)]) {
            schedulelist[parseInt(task.taskid)].stop()
        }
        return
    },
    /**
     * function to send a email reminder and to move the completed tasks
     * @param.task - task details
     * @param.task.to - receiver of the email
     * @param.task.name - name of the task
     * 
     * Email will be send and task will be moved to another collection
     */
    completeTasks: (task) => {
        try {
            scheduleOperations.sendMail({
                    "to": task.to,
                    "subject": "To do Reminder",
                    "html": `Hi, <br/> <br/> Reminder for the Task ${task.name}<br/> Regards <br/> Task Management System`
                })
                .then(async (data) => {
                    var tasks = await dbconnect.getDocument({
                        "collection": {
                            "taskid": task.taskid
                        },
                        "collectionName": global.config.db.collectionNames.task
                    })
                    tasks[0].completion_status = true
                    await dbconnect.insertDocument({
                        "collection": tasks[0],
                        "collectionName": global.config.db.collectionNames.expirytask
                    })
                    await dbconnect.deleteDocument({
                        "collection": {
                            "taskid": task.taskid
                        },
                        "collectionName": global.config.db.collectionNames.task
                    })
                })
                .catch((err) => {
                    console.log(err)
                })
        } catch (err) {
            console.log(err)
        }
    },
    /***
     * generic function  to send email using nodemailer
     * @param mailOptions.to - receiver of the email
     * @param mailOptions.subject - subject of the email
     * @param mailOptions.html - body of the email
     * @returns Promise
     */
    sendMail: (mailOptions) => {
        return new Promise(async function (resolve, reject) {
            try {
                var transport = nodemailer.createTransport({
                    service: global.config.mail.service,
                    auth: {
                        user: process.env.mailuser,
                        pass: process.env.mailpass,
                    },
                });
                transport.sendMail(mailOptions)
                    .then(function (info) {
                        resolve(info.response)
                    })
                    .catch(function (err) {
                        console.log(err);
                        reject(err)
                    });
            } catch (err) {
                console.log(err)
                reject(err)
            }
        })
    }
}

module.exports = scheduleOperations