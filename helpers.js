const urlDatabase = { //it's an object
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "aJ48lW" },  //urlDatabase[req.params.shortURL]["longURL"]
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
};

const users = {     //Create a users Object   access id : users.id
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

//helper function :   db: user database
const fetchEmail = (db, email) => {
  for(const id in db) { //every key:id
    if (db[id].email === email) {
      return db[id]; //return the key of db object
    }
  }
  return false;
};


const urlsForUser = function(id) {
  const urlsOfUser = {};
  for (const key in urlDatabase) {
    if(urlDatabase[key]["userID"] === id) {
      urlsOfUser[key] = urlDatabase[key];
    }
  }
  return urlsOfUser;
}

// const updateUrlDatabase = function(shortURL, longURL, userID) {

//   //add 

//   urlDatabase[shortURL] = {
//     longURL,
//     userID
//   }
// }

module.exports = { fetchEmail , urlsForUser, urlDatabase, users }