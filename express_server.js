
const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

app.set("view engine", "ejs") //This tells the Express app to use EJS as its templating engine

const urlDatabase = { //it's an object
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};
//Getting Ready for POST Requests(we need another piece of middleware: body-parser)
const bodyParser = require("body-parser"); //we installed bodyparser///// it is a library
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res) => {
  res.send("Hello!");                     // I can hear you
});
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase); //{"b2xVn2":"http://www.lighthouselabs.ca","9sm5xK":"http://www.google.com"}
});
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
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