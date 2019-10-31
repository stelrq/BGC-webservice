const express = require('express');

const pgp = require('pg-promise')();

pgp.pg.defaults.ssl = true;

let db;

db = pgp(process.env.DATABASE_URL);

if(!db) {
    console.log("SHAME! Follow the intructions and set your DATABASE_URL correctly");
    process.exit(1);
 }
module.exports = db;