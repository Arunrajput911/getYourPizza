require("dotenv").config();
const express=require("express");
const app=express();
const ejs=require("ejs");
const path=require("path");
const expressLayout = require("express-ejs-layouts");
const mongoose= require("mongoose");
const session=require("express-session");
const flash=require("express-flash");
const passport=require("passport");
const Emitter = require('events')

const MongoDbStore= require("connect-mongo")(session);

//Assets
app.use(express.static('public'));
app.use(flash());
app.use(express.urlencoded({extended:false}))
app.use(express.json());//json data recive krne ke liye

//event emitter
const eventEmitter = new Emitter();
app.set('eventEmitter', eventEmitter)


//database connection


mongoose.connect(process.env.MONGO_CONNECTION_URL,{useNewUrlParser:true, useCreateIndex:true, useUnifiedTopology:true, useFindAndModify:true});
const connection = mongoose.connection;
connection.once('open',() => {
    console.log("Database connected....");
}).catch(err => {
    console.log('Connected failed....');
});

//session store
let mongoStore = new MongoDbStore({
    mongooseConnection:connection,
    collection:'sessions'
});

//session config
app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave:false,
    store:mongoStore,//nhi to by default memory mai store kr dega isliye db mai store krne ke liye mongostore banana pda
    saveUninitialized:false,
    cookie:{maxAge:1000*60*60*24} //24 hours
}))


//set template engine
app.use(expressLayout);
app.set('views', path.join(__dirname, '/resources/views'));
app.set("view engine",'ejs');

//passport config
const passportInit=require("./app/config/passport")
passportInit(passport)
app.use(passport.initialize());
app.use(passport.session());

//global middleware
app.use((req,res,next) => {
    res.locals.session = req.session;
    res.locals.user = req.user;
    next();
    })

// routes import
require("./routes/web.js")(app)

app.use((req,res) => {
    // res.status(404).render("errors/404")
    res.status(404).send("404,Page Not Found")
})




const PORT = process.env.PORT || 3300
const server = app.listen(PORT, () => {
    console.log("server is running on 3300 port");
    //console.log(`server is running on port ${PORT}`)
});

//socket 
const io = require('socket.io')(server)
io.on('connection',(socket) => {
   //join
socket.on('join',(orderId) => {
    //    console.log(orderId)
    socket.join(orderId);
})
})


eventEmitter.on('orderUpdated',(data) => {
    io.to(`order_${data.id}`).emit('orderUpdated',data);
})

eventEmitter.on('orderPlaced',(data) => {
    io.to('adminRoom').emit('orderPlaced',data);
})