// these roles are customizable, and should match the routes.json attrs

// lists
let admin_list = [];
let editor_list = ["qigong@gwu.edu"];

let viewer_list = [];
// admin users
let admin_attrs = ['admin', 'write']
// edit users
let editor_attrs = ['write']
// normal users
let viewer_attrs = []
// prep for mongo
var users = []

admin_list.forEach(x=>{
  users.push({name:x, attrs: admin_attrs})
})

editor_list.forEach(x=>{
  users.push({name:x, attrs: editor_attrs,})
})
lists
viewer_list.forEach(x=>{
  users.push({name:x, attrs: viewer_attrs})
})

db.authorization.insertMany(name:"",alias:"",attrs:'write'])
