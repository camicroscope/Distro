// admin users
let admins = [{"name":"admin@camicroscope.org", "attrs": ['admin', 'editor']}]
// edit users
let editors = [{"name":"editor@camicroscope.org", "attrs": ['admin', 'editor']}]
// normal users
let editors = [{"name":"someone@camicroscope.org", "attrs": ['admin', 'editor']}]
// prep for mongo

db.authorization.insertMany(admins)
db.authorization.insertMany(editors)
db.authorization.insertMany(editors)
