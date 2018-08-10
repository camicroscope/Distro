db.createCollection("collection", {
  validator: {
     $jsonSchema: {
       bsonType: "object",
        required: ["name", "type", "contents"],
        properties: {
           name: {
              bsonType: "string",
              description: "must be a string and is required"
           },
           type: {
              enum: ["slide", "collection"],
              description: "can be a collection of slides or of collections"
           },
           contents: {
              bsonType: "array",
              description: "must have contents"
           }
         }
     }
 }
});

db.createCollection("authorization", {
  validator: {
     $jsonSchema: {
       bsonType: "object",
        required: ["name"],
        properties: {
           name: {
              bsonType: "string",
              description: "must be a string and is required"
           },
           slides: {
              bsonType: "array",
              description: "slides user has access to"
           },
           collections: {
              bsonType: "array",
              description: "must have contents"
           }
         }
     }
 }
});

db.createCollection("slide", {
   validator: {
      $jsonSchema: {
        bsonType: "object",
         required: ["name", "location", "mpp"],
         properties: {
            name: {
               bsonType: "string",
               description: "must be a string and is required"
            },
            location: {
               bsonType: "string",
               description: "must be a string and is required"
            },
            mpp: {
               bsonType: "number",
               minimum: 0,
               description: "must be a string and is required"
            }
          }
      }
  }
});

db.createCollection("heatmap", {
  validator: {
     $jsonSchema: {
       bsonType: "object",
        required: [ "slide", "name", "width", "height", "key", "values" ],
        properties: {
           name: {
              bsonType: "string",
              description: "must be a string and is required"
           },
           slide: {
              bsonType: "string",
              description: "must be a string and is required"
           },
           height: {
              bsonType: "number",
              minimum: 0,
              description: "must be a number and is required"
           },
           width: {
              bsonType: "number",
              minimum: 0,
              description: "must be a number and is required"
           },
           key: {
              bsonType: "string",
              description: "must be a string and is required"
           },
           values: {
              bsonType: "array",
              description: "must be an array of array of values"
           }
         }
     }
 }
});

db.createCollection("mark", {
  validator: {
     $jsonSchema: {
       bsonType: "object",
        required: [ "marktype" ],
        properties: {
          marktype: {
            bsonType: "object",
            required: ["name", "slide", "type"],
            properties: {
             name: {
                bsonType: "string",
                description: "must be a string and is required"
             },
             slide: {
                bsonType: "string",
                description: "must be a string and is required"
             },
             type: {
                bsonType: "string",
                description: "must be a string and is required"
             }
           }
         }
       }
     }
 }
});

db.createCollection("template", {
  validator: {
     $jsonSchema: {
       bsonType: "object",
        required: [ "id", "title", "properties"],
        properties: {
           id: {
              bsonType: "string",
              description: "must be a string and is required"
           },
           title: {
              bsonType: "string",
              description: "must be a string and is required"
           },
           properties: {
              bsonType: "object",
              description: "pure-form questions object",
              additionalProperties: {
                bsonType: "object",
                required: ["title", "type"]
              }
           },
         }
     }
 }
});

db.createCollection("overlay", {
  validator: {
     $jsonSchema: {
       bsonType: "object",
        required: [ "name", "path", "slide"],
        properties: {
           name: {
              bsonType: "string",
              description: "must be a string and is required"
           },
           path: {
              bsonType: "string",
              description: "must be a string and is required"
           },
           slide: {
              bsonType: "string",
              description: "must be a string and is required"
           }
         }
     }
 }
});

db.mark.createIndex({ geometry: "2dsphere" });
