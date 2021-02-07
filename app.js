const { response } = require('express')
const express = require('express')
const https = require('https');
const fs = require('fs');
const bodyParser = require("body-parser");
const app = express()
const path = require('path')
const { body,validationResult } = require('express-validator');
const serveStatic = require('serve-static');

var key = fs.readFileSync(__dirname + '/certs/selfsigned.key');
var cert = fs.readFileSync(__dirname + '/certs/selfsigned.crt');
var options = {
    key: key,
    cert: cert
};

const { MongoClient } = require("mongodb");
const username = 'user1'
const password = 'userPassword1'
const clustername = 'cluster0.rrnae'
const dbname = 'full-integration-solution'
const url = `mongodb+srv://${username}:${password}@${clustername}.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(url);

const db = connectmongodb();

async function connectmongodb() {
    try {
        await client.connect()
        console.log('connected to server')
        let db = client.db(dbname)
        console.log(`first print: ${db}`)
        return db
    } catch (error) {
        console.log(error)
    }
}

async function insertline(collection,formEntryObject) {
    try {
        let dbo = Promise.resolve(db);
        let dbCol = await dbo.then(function(dbo) {
            return dbo.collection(collection)});
        
        await dbCol.insertOne(formEntryObject);
        const entry = await dbCol.findOne();
        console.log(`Entry success with last entry: ${entry}`)        
    } catch (error) {
        console.log(error)
    }
}



app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static('homepage'));
app.use('/redirecting',express.static('redirect'));
app.use('/.well-known/pki-validation',express.static('.well-known/pki-validation',{dotfiles:'allow'}));
// app.use(serveStatic(path.join(__dirname, '.well-known/pki-validation'), { 'index': ['D901B1901CB9CE4F5265C7A54AAB35AC.txt'] },{dotfiles:'allow'}))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post(
    '/redirecting/response.html', 
    body('firstname', 'Empty name').trim().isLength({ min: 1 }).escape(),
    body('lastname', 'Empty name').trim().isLength({ min: 1 }).escape(),
    body('email', 'not an email').isEmail(),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        };
        res.redirect('./response.html')

        let body = req.body
        let timestamp = getTimeStamp();
        let formEntryObject = createformentry(body,timestamp);
        console.log(formEntryObject)
        let collection = 'forms'
        insertline(collection,formEntryObject);



})
const port = 443
var server = https.createServer(options, app);
server.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
    console.log(`Serving files from ${__dirname}/homepage`)
})

// app.listen(port, () => {
//     console.log(`Example app listening at http://localhost:${port}`)
//     console.log(`Serving files from ${__dirname}/homepage`)
// })

function getTimeStamp() {
    let date_ob = new Date();

    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes();
    let seconds = date_ob.getSeconds();
    // let timestamp = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
    let timestamp = `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`
    return timestamp;
}

function createformentry(body,timestamp) {
    let firstname = body.firstname;
    let lastname = body.lastname;
    let email = body.email;
    let subject = body.subject;
    return {
        firstname: firstname,
        lastname: lastname,
        email: email,
        subject: subject,
        timestamp: timestamp
    };
}