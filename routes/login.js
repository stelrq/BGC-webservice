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
    console.log(email + theirPW);
    if(email && theirPW){
        console.log('here');
        db.one('SELECT Password, Salt FROM Members WHERE Email=$1', email)
        .then(row=>{
            console.log(row);
            let salt = row['salt'];
            let ourSaltedHash = row['password'];
            console.log('HERE3');
            let theirSaltedHash = getHash(theirPW, salt);
            console.log('HERE5');
            let wasCorrectPw = ourSaltedHash === theirSaltedHash;
            console.log(theirPW);
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