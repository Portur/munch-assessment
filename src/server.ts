import * as dotenv from 'dotenv'
import app from './config/server'

dotenv.config()

app.listen(process.env.SERVER_PORT)

console.log(`server started: http://localhost:${process.env.SERVER_PORT}`)