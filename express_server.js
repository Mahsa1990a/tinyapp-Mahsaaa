const express = require("express");
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
const app = express();

app.use(cookieParser())
app.use(bodyParser.urlencoded({extended: true}));

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

const users = {     //Create a users Object
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
}

//Add a POST Route to Receive the Form Submission
app.post("/urls", (req, res) => {
  //we are definig shorUrl and longUrl:
  let shortUrl = generateRandomString(); //is gonna be that func with random number
  let longUrl = req.body.longURL; //calling objects req(is object), we need value of body(which body is object) --> { longURL: 'google.com' }
  
  //urlDatabase[shortUrl] = longUrl;            //then updating our urlDatabase obj   ,,, //shortUrl: key & longUrl: value
  //console.log(urlDatabase); //each time we are getting new shortURL in object

 //          URLs Belong to Users:           \\
  urlDatabase[shorturl] = {longurl: longUrl, userID: req.cookies.user_id}

  res.redirect(`/urls/${shortUrl}`)
  //console.log(req); //will show huge files, that's why we say req.body to have only body part
  //we need only body of req:
  //console.log(req.body);  // Log the POST request body to the console
  //res.send("Ok");         // Respond with 'Ok' (we will replace this)
  
  //res.redirect('/urls/:shortUrl')
});

//helper function :   db: user database
const fetchEmail = (db, email) => {
  for(const id in db) { //every key:id
    if (db[id].email === email) {
      return db[id]; //return the key of db object
    }
  }
  return false;
}

app.post("/register", (req, res) => {
  const id = generateRandomString()  //you can use that function as random id
  const {email, password} = req.body //values from fontend

  if(email === "" || password === ""){
    return res.status(400).send("email or password is invalid");
  } else if (fetchEmail(users, email)){
    return res.status(400).send("email is already in use");
  }
  //console.log(req.body); //{ email: 'amerimahsa@yahoo.com', password: '1234' }
    const key = id; //defining a key
    const newUser = { //defining a new user from users
      id,
      email,
      password
    };
  users[key] = newUser;
  console.log(users); //should be before redirect
  res.cookie('user_id', id) //set a user_id cookie containing the user's newly generated ID
  res.redirect("/urls");
});

app.get("/register", (req, res) => {
  const user = users[req.cookies.user_id] ? users[req.cookies.user_id].email : ""; //does or not user exist(if does, pass rhe email)
  const templateVars = {
    username: user
  };
  res.render("urls_register", templateVars)//creating urls_register.ejs
});

app.get("/login", (req, res) => { //new get login
  const user = users[req.cookies.user_id] ? users[req.cookies.user_id].email : ""; //does or not user exist(if does, pass rhe email)
  const templateVars = {
    username: user
  };
  res.render("urls_login", templateVars) //creating urls_login.ejs
});


app.post("/login", (req, res) => {
 
  const {email, password} = req.body 

  if(email === "" || password === ""){
    return res.status(403).send("email or password is invalid");
  } 
  console.log(users)
  const user = fetchEmail(users, email) //defining the function
    if (!user || user.password !== password ) { //if user doesn't exist and password doesn't match 
      return res.status(403).send("user or password is not match") 
      //compare password given in the form and existing user password
    }
      //if the user exist and password match :
  res.cookie('user_id', user.id) //set a user_id cookie containing the user's newly generated ID
  res.redirect("/urls");
});

app.post("/logout", (req, res) => {
  //res.clearCookie('name', { path: '/admin' })
  //const username = req.body.user_id
  res.clearCookie('user_id') //updating logout handler to user_id
  res.redirect("/urls");
})

app.post("/urls/:shortURL", (req, res) => { //for updating url/// edit
   urlDatabase[req.params.shortURL] = req.body.longURL;  //update your long url
   //console.log(req.body.longURL)
  res.redirect("/urls");
  //res.send('deleting OK!')
});

app.post("/urls/:shortURL/delete", (req, res) => { //for testing when you go to http://localhost:8080/urls and press delete yoyr address will be the same ulrs
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls")
  //res.send('deleting OK!')
});

app.get("/register", (req, res) => {
  res.render('register')
  //res.send('OK')
})

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
 // console.log('This is req.cookies.user_id '+ req.cookies.user_id) //This is req.cookies.user_id dn6h09
 //console.log("This is users of req coockie ... "+ users[req.cookies.user_id])
  const user = users[req.cookies.user_id] ? users[req.cookies.user_id].email : ""; //does or not user exist(if does, pass rhe email)
  const templateVars = { 
    urls: urlDatabase, 
    //user:user1, //user1 is my value
    username: user
    //username: req.cookies.username
  }; //When sending variables to an EJS template, we need to send them inside an object //// key : urls
  res.render("urls_index", templateVars); //in view we have urls_index.js
});

//Add a GET Route to Show the Form and should be before app.get("/urls/:id", ...)
app.get("/urls/new", (req, res) => {
  //console.log(req.cookies)
  
  const user = users[req.cookies.user_id] ? users[req.cookies.user_id].email : ""; //does or not user exist(if does, pass rhe email)
  const templateVars = { 
    urls: urlDatabase, 
    username: user
  }
  if (!user){   //if someone is not logged in when trying to access /urls/new, redirect them to the login page
    
    return res.render('urls_login', templateVars)
  }
  res.render("urls_new", templateVars);
});

//Adding a Second Route and Template
app.get("/urls/:shortURL", (req, res) => { // : in front of id indicates that id is a route parameter, so :  the value in this part of the url will be available in the req.params object.
  const user = users[req.cookies.user_id] ? users[req.cookies.user_id].email : "";
  const templateVars = { 
    shortURL: req.params.shortURL, 
    longURL: urlDatabase[req.params.shortURL],
    username: user
  }; //object
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