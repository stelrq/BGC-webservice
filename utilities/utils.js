let db = require('./sql_conn.js');

const crypto = require('crypto');

function sendEmail(from, receiver, subj, message) {
    //will fill in
    console.log('Email not sent: ' + message);
}

function getHash(pw, salt) {
    console.log('here4');
    return crypto.createHash("sha256").update(pw+salt).digest("hex");
}

module.exports={
    db, getHash, sendEmail
};