import express, { Application } from 'express'
const app : Application = express()
const PORTNUMBER = 4001

// ENV File Configuring
import * as dotenv from 'dotenv'
dotenv.config()

app.get('/', (req, res) => {
    res.send('User Service is up and running!')
})



app.listen(PORTNUMBER, () => {
    console.log(`User Service is running on port ${PORTNUMBER}`)
})