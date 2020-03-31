// For use with caracal, this is really just a demo.

// admin example, can see all (**) filters
// editor example, can see Public and Private
// viewer example
let randomPerson = {'email':'viewer@camicroscope.org', 'userFilter':["Public"], 'userType':'Null'}
// users not added would have been represented by the below
let randomPerson = {'email':'random@me.com', 'userFilter':["Public"], 'userType':'Null'}

db.user.insertMany(users)
