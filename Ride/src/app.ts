
import express, { Application } from 'express'
const app : Application = express()
const PORTNUMBER = 4002
import cors from 'cors';
import rideRoutes from './routes/rideRoutes'
import morgan from 'morgan';
import redisClient from './services/redisConnector'



// ENV File Configuring
import * as dotenv from 'dotenv'
dotenv.config()

// Database configuring
import  connectDB  from './database/dbConfig'
connectDB()




redisClient.connect().then(() => {
    console.log('Connected to Redis');
}).catch((err) => {
    console.error('Redis connection error:', err);
});

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan('dev'));
app.use(cors());


app.get('/', (req, res) => {
    res.send('Ride Service is up and running!')
})

// User Routes
app.use('/api/ride', rideRoutes)





app.listen(PORTNUMBER, () => {
    console.log(`Ride Service is running on port ${PORTNUMBER}`)
})