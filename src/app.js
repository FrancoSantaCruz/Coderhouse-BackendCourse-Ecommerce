import express from "express";
import { __dirname } from "./utils.js";
import handlebars from "express-handlebars";
import "./db/db.config.js";


import viewsRouter from "./routes/views.router.js";
import usersRouter from "./routes/users.router.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import sessionsRouter from "./routes/sessions.router.js";


import cookieParser from "cookie-parser";
import MongoStore from "connect-mongo";
import session from "express-session";
import passport from "passport";
import { Server } from 'socket.io' // WebSocket


import "./passport.js";
import config from "./config.js";


import { usersManager } from "./managers/users.manager.js";
import { messagesManager } from "./managers/messages.manager.js";



const app = express();

app.use(express.static(__dirname+ '/public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
    session({
        store: new MongoStore({
            mongoUrl: config.mongo_uri,
        }),
        secret: config.session_secret,
        cookie: { maxAge: 5 * 60000 },
    })
);

// passport
app.use(passport.initialize());
app.use(passport.session());

// handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

// routes
app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/users", usersRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/sessions", sessionsRouter);

const httpServer = app.listen(8080, () => {
    console.log("Server is running on port 8080.\nhttp://localhost:8080/");
});

const socketServer = new Server(httpServer);

// ----------------------------- WebSocket ------------------------------------
socketServer.on('connection', (socket) => {
    let userFound
    socket.on('userJoin', async(user) => {
        userFound = await usersManager.findByEmail(user.email)
        socket.emit('newUserBroadcast', userFound)
    })
    socket.on('message', async(msg) => {
        let chat = {
            chats: [
                {
                    autor: userFound._id,
                    content: msg.message,
                    date: new Date()
                }
            ]
        }
        let chatFound = await messagesManager.findById(msg.cid)
        chatFound.chats = [...chatFound.chats, ...chat.chats]
        await messagesManager.updateOne(msg.cid, chatFound)

        let messages = await messagesManager.findByField({'_id': msg.cid})
        socketServer.emit('chat', messages.chats)
    })
})

/*
    Products: 
        - All products view.
        - Product Detail view.
        - Create a Product view (modal)
        - Delete a Product button
        - Add product to cart button
        
    Cart: 
    - All products cart view.
    - Add to cart buttons in every product
    // - Buttons delete or add more of the same product.
*/