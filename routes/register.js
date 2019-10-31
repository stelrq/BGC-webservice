const express = require('express');

const crypto = require('crypto');

let db = require('../utilities/utils').db;

let getHash = require('../utilities/utils').getHash;

let sendEmail = require('../utilities/utils').sendEmail;

var router = express.Router();

const bodyParser = require('body-parser');

router.use(bodyParser.json());

let config = {
    secret: process.env.JSON_WEB_TOKEN
};

router.post('/', (req, res)=>{
    res.type('application/json');

    var first = req.body['first'];
    var last = req.body['last'];
    var username = req.body['username'];
    var email = req.body['email'];
    var password = req.body['password'];

    if (first && last && username && email && password) {
        let salt = crypto.randomBytes(32).toString("hex");
        let salted_hash = getHash(password, salt);

        let params = [first, last, username, email, salted_hash, salt];
        db.none("INSERT INTO MEMBERS(FirstName, LastName, Username, Email, Password, Salt) VALUES($1, $2, $3, $4, $5, $6)", params)
         .then(()=>{
            let token = jwt.sign({username: email},
                config.secret,
                {
                    expiresIn: '24h'
                }
            );
            res.json ({
                success: true,
                token: token
            });
             sendEmail("bearygoodconnections@gmail.com", email,
              "Welcome!", "<strong>HELLO I HOPE YOU LIKE PHISH</strong>");
         }).catch((err)=>{
             console.log(err);
             res.send({
                 success:false,
                 error:err
             });
         });
        } else {
            res.send({
                success:false,
                input:req.body,
                error:"Missing required info"
            });
        }
});

module.exports = router;