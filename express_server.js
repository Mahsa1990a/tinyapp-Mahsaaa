const express = require("express");
const cookieParser = require('cookie-parser');
//const bodyparser = require('body-parser')
const app = express();
app.use(cookieParser())
//app.use(bodyParser.urlencoded({extended: false}));

const PORT = 8080; // default port 8080

app.set("view engine", "ejs") //This tells the Express app to use EJS as its templating engine

//we will implement a function that returns a string of 6 random alphanumeric characters:
const generateRandomString = () => {
  // creates a random alpha-numeric string of 6 characters
  let id = Math.random().toString(36).substring(2, 8);
  return id; //it's gonna return a random number like h0agl2
}; //then we app.post it

const urlDatabase = { //it's an object
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

//Getting Ready for POST Requests(we need another piece of middleware: body-parser)
const bodyParser = require("body-parser"); //we installed bodyparser///// it is a library
app.use(bodyParser.urlencoded({extended: true}));


//Add a POST Route to Receive the Form Submission
app.post("/urls", (req, res) => {
  //we are definig shorUrl and longUrl:
  let shortUrl = generateRandomString(); //is gonna be that func with random number
  let longUrl = req.body.longURL; //calling objects req(is object), we need value of body(which body is object) --> { longURL: 'google.com' }
  
  urlDatabase[shortUrl] = longUrl;//then updating our urlDatabase obj
  //console.log(urlDatabase); //each time we are getting new shortURL in object

  res.redirect(`/urls/${shortUrl}`)
  //console.log(req); //will show huge files, that's why we say req.body to have only body part
  //we need only body of req:
  //console.log(req.body);  // Log the POST request body to the console
  //res.send("Ok");         // Respond with 'Ok' (we will replace this)
  
  //res.redirect('/urls/:shortUrl')
});

app.post("/urls/:shortURL", (req, res) => { //for updating url
   urlDatabase[req.params.shortURL] = req.body.longURL;  //update your long url
   //console.log(req.body.longURL)
  res.redirect("/urls")
  //res.send('deleting OK!')
});


app.post("/urls/:shortURL/delete", (req, res) => { //for testing when you go to http://localhost:8080/urls and press delete yoyr address will be the same ulrs
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls")
  //res.send('deleting OK!')
});

//Redirect Short URLs
app.get("/u/:shortURL", (req, res) => {
   const longURL = urlDatabase[req.params.shortURL];
  res.redirect(longURL);
});

app.get("/", (req, res) => {
  res.send("Hello!");                  
});

app.get("/urls.json", (req, res) => { //JSON string representing entire urlDatabase obj:
  res.json(urlDatabase); //{"b2xVn2":"http://www.lighthouselabs.ca","9sm5xK":"http://www.google.com"}
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");  //"Hello World".
});

//adding res.render()           //urls_index.js in view will recieve data need to display
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase }; //When sending variables to an EJS template, we need to send them inside an object //// key : urls
  res.render("urls_index", templateVars); //in view we have urls_index.js
});

//Add a GET Route to Show the Form and should be before app.get("/urls/:id", ...)
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

//Adding a Second Route and Template
app.get("/urls/:shortURL", (req, res) => { // : in front of id indicates that id is a route parameter, so :  the value in this part of the url will be available in the req.params object.
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]}; //object
  res.render("urls_show", templateVars);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

// when we do :
//curl -i http://localhost:8080/hello we will see :
// We see the entire HTTP response string:

// the response headers (one on each line), followed by
// the HTML content that the /hello path responds with: <html><body>Hello <b>World</b></body></html>