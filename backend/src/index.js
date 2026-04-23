import express from 'express'
import 'dotenv/config'
import { connect } from './config/db.js'

const app = express()
const port = process.env.PORT || 3000

await connect()

app.listen(port, () => {
    console.log(`🚀 Server running on port: ${port}`)
})