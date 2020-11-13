//helper function :   db: user database
const fetchEmail = (db, email) => {
  for(const id in db) { //every key:id
    if (db[id].email === email) {
      return db[id]; //return the key of db object
    }
  }
  return false;
};

module.exports = { fetchEmail }