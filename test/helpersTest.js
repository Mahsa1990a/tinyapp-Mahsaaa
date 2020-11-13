const { assert } = require('chai');

const { fetchEmail, users } = require('../helpers.js');


// const fetchEmail = (db, email) => {
//   for(const id in db) { //every key:id
//     if (db[id].email === email) {
//       return db[id]; //return the key of db object
//     }
//   }
//   return false;
// };


describe('getUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = fetchEmail(users , "user@example.com")
    //console.log('this is user ', user)
    const expectedOutput = "userRandomID";
    // Write your assert statement here
    assert.equal(user.id, expectedOutput );
  });
  it('should return undefined with invalid email', function() {
    const user = fetchEmail(users , "a@b.com")
    //console.log('this is invalid user ', user.id)
    const expectedOutput = false;
    // Write your assert statement here
    assert.equal(user, expectedOutput );  //or (user.id, undefined)
    assert.equal(user.id, undefined);
  });
});

