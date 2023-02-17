let slides = [{"_id": ObjectId("000000000000000000000011"), "name":"X-1","study":"","specimen":"","location":"/images/sample.svs","mpp-x":"0.22834699609526637","mpp":"0.22834699609526637","height":null,"width":null,"vendor":"hamamatsu","level_count":1,"objective":-1.0,"md5sum":"09bc52f04731249cc808060fbc354291","timestamp":1.5797141662385912E+09,"collections":["000000000000000000000001"]},
{"_id": ObjectId("000000000000000000000012"),"name":"X-2","study":"","specimen":"","location":"/images/sample.svs","mpp-x":"0.22834699609526637","mpp":"0.22834699609526637","height":null,"width":null,"vendor":"hamamatsu","level_count":1,"objective":-1.0,"md5sum":"bc929d485040ffcc28c2b24ed6a62260","timestamp":1.5797141486405506E+09,"collections":["000000000000000000000001"]},
{"_id": ObjectId("000000000000000000000013"), "name":"Y-1","study":"","specimen":"","location":"/images/sample.svs","mpp-x":"0.22834699609526637","mpp":"0.22834699609526637","height":null,"width":null,"vendor":"hamamatsu","level_count":1,"objective":-1.0,"md5sum":"09bc52f04731249cc808060fbc354291","timestamp":1.5797141662385912E+09,"collections":["000000000000000000000002"]},
{"_id": ObjectId("000000000000000000000014"), "name":"Z-1","study":"","specimen":"","location":"/images/sample.svs","mpp-x":"0.22834699609526637","mpp":"0.22834699609526637","height":null,"width":null,"vendor":"hamamatsu","level_count":1,"objective":-1.0,"md5sum":"bc929d485040ffcc28c2b24ed6a62260","timestamp":1.5797141486405506E+09,"collections":["000000000000000000000003"]}]

db.insertMany(slides)

let collections = [
{"_id": ObjectId("000000000000000000000001"),"name":"Training X","description":"X collection w feedback", "hasFeedback" : true},
{"_id":ObjectId("000000000000000000000002"),"name":"Training Y","description":"Y collection no feedback", "hasFeedback" : false},
{"_id":ObjectId("000000000000000000000003"),"name":"Training Z","description":"Z collection no feedack", "hasFeedback" : false}]


db.collection.insertMany(collections)


let labelings = [
  {"_id":"000000000000000000000021","creator":"FDA-HTT-batch001","provenance":{"image":{"slide":"000000000000000000000011","name":"X-1"},"analysis":{"source":"human","execution_id":"HTT-TILS-001-03B_left_4934_top_68036","computation":"label","name":"HTT-TILS-001-03B_left_4934_top_68036"}},"properties":{"type":"No Label","til_density":"None","width":2190.0,"height":2190.0,"x":4934.0,"y":68036.0},"annotations":[],"subrois":[],"parent":null,"geometries":{"type":"FeatureCollection","features":[{"type":"Feature","properties":{"style":{"color":"#000000"}},"geometry":{"type":"Polygon","coordinates":[[[4934.0,68036.0],[7124.0,68036.0],[7124.0,70226.0],[4934.0,70226.0],[4934.0,68036.0]]]},"bound":{"type":"Polygon","coordinates":[[[4934.0,68036.0],[7124.0,68036.0],[7124.0,70226.0],[4934.0,70226.0],[4934.0,68036.0]]]}}]},"alias":"HTT-TILS-001-03B.ndpi_x4934.2190_y68036.2190","create_date":{"$date":"2020-02-10T16:46:46Z"}}
]

db.labeling.insertMany(labelings)
