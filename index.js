const express = require("express");
const mustacheExpress = require("mustache-express");
const bodyParser = require("body-parser");
const session = require("express-session");
const port = process.env.PORT || 3000;

var  app = express();

var users = [
    {
        "username": "admin",
        "password": "admin"
    }
];



app.engine("mustache", mustacheExpress());

app.set("views", "./public");
app.set("view engine", "mustache");

app.use("/", express.static("./public"));
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({
    secret: "banana cat monkey tree",
    resave: false,
    cookie: {
        maxAge: 900000
    }
}));


function userAuth(req, res, next){
    if (!req.session.user){
        return res.redirect("/login");
    }
    else {
        return next();
    }
}

app.get("/signup", (req, res) => {
    res.render("signup"); 
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.post("/login", (req, res) => {
    if (!req.body || !req.body.username || !req.body.password){
        return res.redirect("/login");
    }

    let userProvidedData = req.body;
    let userRecord = users.find( x => x.username === userProvidedData.username);

    if(!userRecord){
        return res.redirect("/login");
    }
    if(userProvidedData.password == userRecord.password){
        req.session.user = userRecord;
        req.session.clicks = 0;
        return res.redirect("/");
    }
    else {
        return res.redirect("/login");
    }
});

app.post("/increment", (req,res) => {
    console.log(req.session);
    req.session.clicks += 1;
    res.send({count: req.session.clicks});
    // return res.redirect("/");
});

app.get("/", userAuth, (req, res) => {
    res.render("index", {session: req.session});
});

app.post("/users", (req,res)=>{
    if(!req.body || !req.body.username || !req.body.password){
        return res.redirect("/signup");
    }

    var newUser = {
        username: req.body.username,
        password: req.body.password
    };

    users.push(newUser);
    return res.redirect("login");
});

app.get("/logout", (req,res) =>{
    req.session.destroy();
    return res.redirect("/");
});


app.listen(port, ()=>console.log("Server running on: ", port));
