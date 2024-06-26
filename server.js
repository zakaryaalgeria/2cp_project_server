import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import cookieParser from "cookie-parser"
import errorHandler from './middlewares/errorHandler.js'
import dbConnect from './config/dbConnect.js'
import morgan from 'morgan'
import fs from 'fs';
import http from 'http';
import {Server} from 'socket.io'
import limiter from './utils/requestLimiter.js'


// routes
import authRouter from './routes/auth.js'
import adminRouter from './routes/admin.js'
import userRouter from './routes/user.js'
import clientRouter from './routes/client.js'
import freelencerRouter from './routes/freelencer.js'
import chatRouter from './routes/chat.js'
import enquiryRouter from './routes/enquiry.js'
import notificationRouter from './routes/notifcation.js'
import payment from './routes/payment.js'
import publicRouter from './routes/public.js'

// init
dotenv.config()
const app = express()
const PORT = process.env.PORT || 5000
const HOST = "localhost"
dbConnect()

// Middleware to log requests
app.use((req, res, next) => {
    const logStream = fs.createWriteStream('./utils/log.txt', { flags: 'a' });
    logStream.write(`[${new Date().toISOString()}] ${req.ip} - ${req.method} ${req.originalUrl}\n`);
    logStream.end();
    next();
});

// middlewares
app.use(cors({credentials: true, origin: 'http://localhost:5173'}))
app.use(express.json({limit: '100mb'}))
app.use(express.urlencoded({limit: '100mb', extended: false}))
app.use(cookieParser())
app.use(morgan('dev'))
app.use(limiter)
// routers

app.use('/api/auth',authRouter)

app.use('/api/admin',adminRouter)

app.use('/api/user',userRouter)

app.use('/api/client',clientRouter)

app.use('/api/freelencer',freelencerRouter)

app.use('/api/chat',chatRouter)

app.use('/api/enquiry',enquiryRouter)

app.use('/api/notification',notificationRouter)

app.use('/api/payment',payment)

app.use('/api/public',publicRouter)

// error middlewares
app.use(errorHandler)


// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
    pingTimeout: 50000,
    cors: {
      origin: 'http://localhost:5173',
    }
});

 

let users = [] ;

const addUser = (userId,socketId)=>{
    !users.some(user=>user.userId=== userId) && users.push({userId,socketId})
}

const removeUser = (socketId) => {
    users = users.filter(user => user.socketId !== socketId)
}

const getUser = (userId) => {
    return users.find(user => user.userId ===  userId)
}

// WebSocket event handlers
io.on('connection', (socket) => {
    
    // When connect
    console.log('A user connected:', socket.id);
    socket.on('addUser',(userId)=>{
        addUser(userId,socket.id)
        io.emit('getUsers',users)
    })

    // Send and get message
    socket.on('sendMessage', ({senderId,recieverId,text,photo}) => {
        const user = getUser(recieverId) ;
        io.to(user?.socketId).emit("getMessage",{
            sender : senderId,
            content:text ,
            photo
        })
    });

    // When disconnect
    socket.on('disconnect', () => {
        console.log('User disconnected: ', socket.id);
        removeUser(socket.id)
        io.emit('getUsers',users)
    });
});

export { io ,getUser };

// Start server
server.listen(PORT,HOST, () => {
    console.log(`the server is running on  http://${HOST}:${PORT}`)
})