// furst run mongo (probably `docker exec-it ca-mongo mongo`)
// then run `use camic`
// then you can use these to add two collections and one slide each
let testCollections = [
    {"name":"HTT-001","description":"This Is The Batch 001 of HTT-TILS-001"},
    {"name":"HTT-002","description":"This Is The Batch 002 of HTT-TILS-001, with roi create", "task":"roiSelection"}
]

db.collection.insertMany(testCollections)

let col1Id = db.collection.findOne({"name":"HTT-001"})['_id'].valueOf()
let col2Id = db.collection.findOne({"name":"HTT-002"})['_id'].valueOf()

let testSlides = [
    {"filename":"/images/sample.svs","mpp-x":"0.2505","mpp-y":"0.2505","height":80453,"width":131536,"vendor":"aperio","level_count":1,"objective":40,"md5sum":"bde726696806f0d1e030237458dca3ee","study":"","specimen":"","upload_date":"7/11/2019, 10:27:46 AM","name":"sample1","location":"/images/sample.svs","mpp":0.2505,"mpp_x":0.2505,"mpp_y":0.2505,"allow_download":"false", collections:[col1Id]},
    {"filename":"/images/sample.svs","mpp-x":"0.2505","mpp-y":"0.2505","height":80453,"width":131536,"vendor":"aperio","level_count":1,"objective":40,"md5sum":"bde726696806f0d1e030237458dca3ee","study":"","specimen":"","upload_date":"7/11/2019, 10:27:46 AM","name":"sample2","location":"/images/sample.svs","mpp":0.2505,"mpp_x":0.2505,"mpp_y":0.2505,"allow_download":"false", collections:[col2Id]}
]

db.slide.insertMany(testSlides)