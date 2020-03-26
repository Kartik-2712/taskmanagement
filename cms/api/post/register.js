var dbconnect = require('../../../_core/dbOperations.js')
var validator = require('validator');
/**
 * Register API
 * @param.email - email address
 * @param.password - password to create the account
 * @param.team - name of the team
 * If the email is not registered, it will be registered else error message will be thrown
 */
module.exports = {
    process: (req, res) => {
        return new Promise((resolve, reject) => {
            try {
                if (!req.body || !req.body.email || !req.body.password || !req.body.team) {
                    reject({
                        "code": 404,
                        "message": "Either mail or password or team is not provided"
                    })
                    return
                }
                if(!validator.isEmail(req.body.email)){
                    reject({
                        "code": 404,
                        "message": "Please Provide a valid email address"
                    })
                    return
                }
                dbconnect.getDocument({
                        "collection": {
                            "email": req.body.email
                        },
                        "collectionName": global.config.db.collectionNames.user
                    })
                    .then(async(userdetails) => {
                        if (userdetails.length == 1) {
                            reject({
                                "code": 404,
                                "message": "Email ID is already registered. Please login with the email and password"
                            })
                            return
                        }
                        var collections = await dbconnect.getDocument({
                            "collection": {},
                            "collectionName": global.config.db.collectionNames.user
                        })
                        dbconnect.insertDocument({
                            "collection": {
                                "userid": collections.length + 1,
                                "email": req.body.email,
                                "password": req.body.password,
                                "created_at": +new Date(),
                                "team": req.body.team
                            },
                            "collectionName": global.config.db.collectionNames.user
                        })
                        resolve({
                            "code": 200,
                            "message": "User is registered successfully",
                            "data": collections
                        })
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