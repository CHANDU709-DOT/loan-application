const express = require('express');
const path = require('path');
const app = express();
const fileUpload = require('express-fileupload') 
const cookieParser = require('cookie-parser');
const connection = require('./model/usermodel')
const dotenv = require('dotenv');
const routepage = require('./routes/pages')
const routeauth = require('./routes/activities');
var http = require('http');
  
dotenv.config({ path: './.env' });
const client = require('./database/database');
const router = require('./routes/pages');

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: false }));
// Parse JSON bodies (as sent by API clients)
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload());
app.engine("html", require("ejs").renderFile);
app.set('view engine', 'hbs');

const publicDirectoryPath = path.join(__dirname, "../public");
app.use(express.static(publicDirectoryPath));

client.connect(function(err){
  if(!err){
  console.log('Postgres SQL is connected');
  }else{
      console.log('error');
  }
});

//Define Routes
app.use('/authservice', routepage);
app.use('/activities', routeauth); 

app.get('/', (req, res) => { 
 // res.redirect("/authservice/login");
res.render('login.hbs')

});
  
const port = process.env.PORT
app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
