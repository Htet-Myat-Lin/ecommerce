import dotenv from "dotenv"
import http from "http"
dotenv.config()
import app from "./app.js"
import { connectDB } from "./config/db.js"
import { initSocket } from "./config/socket.js"

const server = http.createServer(app)

export const io = initSocket(server)

connectDB().then(() => {
    server.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`)
    }
)})

