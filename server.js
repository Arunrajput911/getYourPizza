require("dotenv").config();
const express=require("express");
const app=express();
const ejs=require("ejs");
const path=require("path");
const expressLayout = require("express-ejs-layouts");
const mongoose= require("mongoose");
const session=require("express-session");
const flash=require("express-flash");
const MongoDbStore= require("connect-mongo")(session);

//Assets
app.use(express.static('public'));
app.use(flash());
app.use(express.json());//json data recive krne ke liye

//global middleware
app.use((req,res,next) => {
res.locals.session = req.session;
next();
})

//set template engine
app.use(expressLayout);
app.set('views', path.join(__dirname, '/resources/views'));
app.set("view engine",'ejs');

//database connection
const url='mongodb://localhost/pizza';

mongoose.connect(url,{useNewUrlParser:true, useCreateIndex:true, useUnifiedTopology:true, useFindAndModify:true});
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



// routes import
require("./routes/web.js")(app)




const PORT = process.env.PORT || 3300
app.listen(PORT, () => {
    console.log("server is running on 3300 port");
    //console.log(`server is running on port ${PORT}`)
});