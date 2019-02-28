// slide update metadata structure and copy over
db.images.find().forEach(function(d){
  //MOVE case_id to name
  //COPY mpp-x and -y to _x _y
  //MOVE study_id to study, else study as empty string
  //move specimen_id to specimen, else specimen as empty string
  db.getSiblingDB('camic')['slide'].insert(d);
});

// mark, update metadata structure and copy over
db.objects.find().forEach(function(d){
  // slidename is old case_id
  // specimen and study same conversion as in slide
  // slide is old case_id too, for this conversion
  db.getSiblingDB('camic')['mark'].insert(d);
});
