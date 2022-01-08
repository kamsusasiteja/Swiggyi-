const express = require('express')
const mongoose = require('mongoose')
const url = 'mongodb://localhost/UserDB'

const app= express()

// making a connect
mongoose.connect(url, {useNewUrlParser:true}) //new user parser to avoid some depricated errors

// We should have a connection holder
const con = mongoose.connection

//To know if connected to DB we can use the 'ON' event
con.on('open', () => {
    console.log('Connected to the DB.')
})

//tell express framework that I am using json here

app.use(express.json())


//creating router that routes to api.js

const apiHandler = require('./handlers/api')
app.use('/api',apiHandler)



// We will run on port 9000

app.listen(9000, () => {
    console.log('Server started')
})