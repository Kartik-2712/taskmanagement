var dbconnect = require('../../../_core/dbOperations.js')
var validator = require('validator');
var jwt = require('jsonwebtoken')
/** 
 * Basic login Functionality
 * After Login jwt token will be set and it will be included in cookies
 */
module.exports = {
    process: (req, res) => {
        return new Promise((resolve, reject) => {
            try {
                if (!req.body || !req.body.email || !req.body.password) {
                    reject({
                        "code": "200",
                        "message": "Either username or password is not provided"
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
                    .then(async (userdetails) => {
                        if (userdetails.length == 0) {
                            reject({
                                "code": "200",
                                "message": "Email ID is not registered. Please register"
                            })
                            return
                        }
                        if (userdetails[0].password != req.body.password) {
                            reject({
                                "code": "200",
                                "message": "Either email or password is in-correct"
                            })
                            return
                        }
                        var userObject = {
                            email: userdetails[0].email,
                            team: userdetails[0].team
                        }
                        req.user = userObject;
                        var token = jwt.sign({
                            kuser: userObject
                        }, global.config.jwtKey, {
                            expiresIn: '24h'
                        });
                        res.cookie('AccTkn', token, {
                            expires: new Date(Date.now() + 86400000),
                            httpOnly: true
                        }); //kAccTkn => kriya access token
                        resolve()
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