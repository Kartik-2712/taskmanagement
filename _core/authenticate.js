const dbconnect = require('./dbOperations')
const jwt = require('jsonwebtoken');
var Cookies = require("cookies");
/**
 * generic function to validate the authentication using JWT Token
 * Token will be in cookies or Authorization Header. Token is not there email or password should be query
 */
const authenticate = (req, res, next) => {
    try {
        var cookies = new Cookies(req, res);
        var accToken = cookies.get('AccTkn');
        const authHeader = req.headers.authorization;
        const token = authHeader ? authHeader.split(' ')[1] : undefined
        accToken = accToken ? accToken : token
        var param = req.query ? req.query : req.body
        if (param && param.email && param.password) {
            dbconnect.getDocument({
                    "collection": {
                        "email": param.email
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
                    if (userdetails[0].password != param.password) {
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
                    next()
                })
        } else if (accToken) {
            try {
                var userObj = jwt.verify(accToken, global.config.jwtKey)
            } catch (err) {
                res.send({
                    "code": 404,
                    "message": "Authorization Failed"
                })
                return
            }
            req.user = userObj.kuser
            next()
        }else{
            res.send({
                "code": 404,
                "message": "Authorization Failed"
            })
        }
    } catch (err) {
        console.log(err)
        res.send(err).end()
    }
};
module.exports = authenticate