import express, { Application } from 'express'
const app : Application = express()
const PORTNUMBER = 4001
import cors from 'cors';
import userRoutes from './routes/userRoutes'

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
    res.send('User Service is up and running!')
})

// User Routes
app.use('/api/users', userRoutes)





app.listen(PORTNUMBER, () => {
    console.log(`User Service is running on port ${PORTNUMBER}`)
})