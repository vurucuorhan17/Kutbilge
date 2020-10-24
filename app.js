const express = require("express");
const exphbs  = require('express-handlebars');
var bodyParser = require('body-parser')
const fileUpload = require("express-fileupload");
const { generateDate,limit,truncate,paginate,limitation }  = require("./helpers/hbs");
const expressSession = require("express-session");
const connectMongo = require("connect-mongo");
const methodOverride = require('method-override');


const app = express();

const hbs = exphbs.create({
  helpers: {
    generateDate:generateDate,
    limit:limit,
    truncate:truncate,
    paginate:paginate,
    limitation
  }
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

const path = require("path");
const mongoose = require("mongoose");

mongoose.connect('mongodb://127.0.0.1/kutbilge_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: true
}).then(() => console.log("Database connected")).catch(err => console.log(err));

const mongoStore = connectMongo(expressSession);

app.use(expressSession({
  secret:"test",
  resave: false,
  saveUninitialized: true,
  store: new mongoStore({ mongooseConnection: mongoose.connection })
}));



// Giriş yapmaya göre Linklerini Düzenleme Middleware

app.use((req,res,next) => {
  const {userId} = req.session;
  if(userId)
  {
    res.locals = {
      displayTrue: true
    };
  }
  else
  {
    res.locals = {
      displayTrue: false
    }
  }
  next();
});

// Bildirim gösterme
app.use((req,res,next) => {
  res.locals.sessionFlash = req.session.sessionFlash;
  delete req.session.sessionFlash;
  next();
});

app.use(fileUpload());

app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())

app.use(methodOverride('_method'));


const hostname = "127.0.0.1";
const port = 3000;

app.use(express.static('public'));


const main = require("./routes/main");
const posts = require("./routes/posts");
const users = require("./routes/users");
const admin = require("./routes/admin");
const contact = require("./routes/contact");
const news = require("./routes/news");

app.use("/",main);
app.use("/posts",posts);
app.use("/users",users);
app.use("/admin",admin);
app.use("/contact",contact);
app.use("/news",news);

app.listen(port,hostname,() => console.log(`Server Dinleniyor: http://${hostname}:${port}`));
