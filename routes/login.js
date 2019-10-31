const express = require('express');

let db = require('../utilities/utils').db;

let getHash = require('../utilities/utils').getHash;

var router = express.Router();

const bodyParser = require('body-parser');

router.use(bodyParser.json());

let jwt = require('jsonwebtoken');

let config = {
    secret: process.env.JSON_WEB_TOKEN
};

router.post('/', (req, res)=> {
    let email = req.body['email'];
    let theirPW = req.body['password'];
    let wasSuccessful = false;
    if(email && theirPW){
        db.one('SELECT Password, Salt FROM Members WHERE Email=$1', email)
        .then(row=>{
            let salt = row['salt'];
            let ourSaltedHash = row['password'];
            let theirSaltedHash = getHash(theirPW, salt);
            let wasCorrectPw = ourSaltedHash === theirSaltedHash;
            // console.log(theirSaltedHash);
            // console.log(ourSaltedHash);
            // console.log(wasCorrectPw);
            if (wasCorrectPw) {
                console.log('here2');
                let token = jwt.sign({username: email},
                    config.secret,
                    {
                        expiresIn: '24h'
                    }
                );
            res.json({
                success: true,
                message:'Authentication successful',
                token: token
            });
            } else {
                res.send({
                    success: false,
                    message: 'match failure'
                });
            }
        })
    .catch((err)=>{
        res.send({
            success:false,
            message: 'sql error'
        });
    });
} else {
    res.send({
        success: false,
        message:'missing credentials'
    });
}   
    });
module.exports = router;