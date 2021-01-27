const { response } = require('express')
const express = require('express')
const bodyParser = require("body-parser");
const app = express()
const path = require('path')
const { body,validationResult } = require('express-validator');

const port = 3000

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static('homepage'));
app.use('/redirecting',express.static('redirect'));

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
        // res.sendFile(path.join(__dirname + '/redirect' + '/response.html'));
        res.redirect('./response.html')
        console.log('success')
        console.log(req.body)

})


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
  console.log(`Serving files from ${__dirname}/homepage`)
})

