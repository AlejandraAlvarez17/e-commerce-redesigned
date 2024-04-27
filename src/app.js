// import express from "express";
// import cookieParser from "cookie-parser";
// import session from "express-session";
// import FileStore  from "session-file-store";
// import MongoStore from "connect-mongo";
// const fileStore = FileStore(session);
// import exphbs from "express-handlebars";

// import "./database.js";
// import sessionsRouter from "./routes/sessions.router.js";
// import viewsRouter from "./routes/views.router.js";

// import passport from "passport";
// import initializePassport from "./config/passport.config.js";

const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
//const socket = require("socket.io");
const cookieParser = require("cookie-parser");
require("./database.js");
const PUERTO = 8080;
const passport = require("passport");
const session = require("express-session");
const initializePassport = require("./config/passport.config.js");

const ProductManager = require("../src/controller/product-manager.js");
console.log(ProductManager);
// const productManager = new ProductManager("../express/src/models/product.json");

const productRouter = require("./routes/products.router.js");
const cartsRouter = require("./routes/carts.router.js");
const viewsRouter = require("./routes/views.router.js"); 
const sessionsRouter = require("./routes/sessions.router.js");

//Express-Handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");


//Middleware
app.use(express.urlencoded({ extended: true}));
app.use(express.json());
app.use(express.static("./src/public"));
app.use(express.urlencoded({extended:true}));
//app.use(cookieParser());
const miAltaClaveSecreta = "TinkiWinki";
app.use(cookieParser(miAltaClaveSecreta));
//Le paso la palabra secreta al middleware de Cookie Parser. 

//Handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine","handlebars");
app.set("views","./src/views");

//Middleware de Session: 
app.use(session({
    secret:"secretCoder",
    resave: true,
    //Esta configuración me permite mantener activa la sesion frente a la inactividad del usuario. 

    saveUninitialized: true,
    //Me permite guardar cualquier sesión aun cuando el objeto de sesion no tenga nada para contener. 

    //2) Utilizando el File Storage: 
    //store: new fileStore({path: "./src/sessions", ttl: 100000, retries:1})
    //path: la ruta en donde se van a guardar los archivitos de sesiones. 
    //ttl: Time To Live ( en segundos lo colocamos)
    //retries: cantidad de veces que el servidor tratara de leer el archivo. 

    //3)Utilizando Mongo Store
    // store: MongoStore.create({
    //     mongoUrl:"mongodb+srv://coderhouse53105:coderhouse@cluster0.o9ipohi.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0", ttl: 100
    // })
}))

//Cambios con Passport: 
initializePassport();
app.use(passport.initialize());
app.use(passport.session());



//Rutas
app.use("/api/products", productRouter);
app.use("/api/carts",cartsRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/", viewsRouter);


app.listen(PUERTO,()=>{
    console.log(`Servidor escuchando en el puerto ${PUERTO} `);
})

// const MessageModel = require("./models/message.model.js");
// const io = new socket.Server(httpServer);

//Array de products
//const ProductManager = require("./controllers/product-manager.js");
//const ProductManager = new ProductManager("./src/models/products.json");

//Creamos servidor de Socket.io
//const io = socket(httpServidor);

// io.on("connection",async(socket) => {
//     console.log("Un cliente se conecto");
// })

// socket.on("message", async (data) => {
        
//     //Guardo el mensaje en MongoDB: 
//     await MessageModel.create(data);

//     //Obtengo los mensajes de MongoDB y se los paso al cliente:
//     const messages = await MessageModel.find();
//     io.sockets.emit("message", messages)  
// })

// // enviamos el arrays de products al cliente que se conecto 
// socket.emit("products",await productManager.getProducts());

// // Recibimos el evento "eliminarProduct" desde el cliente:
// socket.on("deleteProduct",async(id) =>{
//     await productManager.deleteProduct(id);
// })


// app.get("/products", async (req, res) => {
//     try {
//         const limit = req.query.limit;
//         const product = await productManager.getProducts();
//         if (limit) {
//             const nuevoArrayRecortado = product.slice(0, limit)
//             res.json(nuevoArrayRecortado);
//         }
//         res.json(product);
//     } catch (error) {
//         res.status(500).json({ error: "Error interno del servidor" })

//     }
// })

// app.get("/products/:pid", async (req,res) => {
//     try{
//         let id = req.params.pid;
//         const product = await productManager.getProductById(parseInt(id));
//         if(!product){
//             return res.json({error:"ID no encontrado"});
//         }
//         res.json(product);
//     } catch(error){
//         res.status(500).json({error: "Error interno del servidor"})
//     }

// })
// //listen del servidor para escuchar puerto


// app.listen(PUERTO, () => {
//     console.log(`Escuchando puerto: ${PUERTO}`);
// })