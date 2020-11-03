const express=require("express");
const app=express();
const ejs=require("ejs");
//not require to install, it is inbuilt module;
const path=require("path");
const expressLayout = require("express-ejs-layouts");


//set template engine
app.use(expressLayout);
app.set('views', path.join(__dirname, '/resources/views'));
app.set("view engine",'ejs');



//Assets
app.use(express.static('public'));

app.get("/", (req,res) => {
    res.render('home');
});

app.get("/cart", (req,res) => {
    res.render('customers/cart');
});

app.get("/login", (req,res) => {
    res.render('auth/login');
});

app.get("/register", (req,res) => {
    res.render('auth/register');
});





const PORT = process.env.PORT || 3300
app.listen(PORT, () => {
    console.log("server is running on 3300 port");
    //console.log(`server is running on port ${PORT}`)
});