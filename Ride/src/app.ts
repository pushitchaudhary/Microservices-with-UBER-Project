
import express, { Application } from 'express'
const app : Application = express()
const PORTNUMBER = 4002
import cors from 'cors';
import rideRoutes from './routes/rideRoutes'


// ENV File Configuring
import * as dotenv from 'dotenv'
dotenv.config()

// Database configuring
import  connectDB  from './database/dbConfig'
connectDB()


app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.use(cors());



app.get('/', (req, res) => {
    res.send('Ride Service is up and running!')
})

// User Routes
app.use('/api/ride', rideRoutes)





app.listen(PORTNUMBER, () => {
    console.log(`Ride Service is running on port ${PORTNUMBER}`)
})