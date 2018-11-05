// run with node
// take in a json file of annotations
// convert annots to new form
// spit out result to stdout

var fs = require("fs");
var annots = JSON.parse(fs.readFileSync("annots.json"));

res = {}
for (x in annots){
  annot = annots[x]
  // pick a color, default style
  color = "#090c63"
  annot.provenance.image.slide = annot.provenance.image.case_id
  annot.properties = {annotations:{name:  annot.provenance.analysis.execution_id}}
  annot.provenance.analysis.execution_id = "_a" + x
  props = {footprint: annot.footprint, style: {color:color, "lineJoin": "round", "lineCap": "round", lineWidth:"30"}}
  if (annot.properties.name in res){
    // recalculate bounds
    s = annot.geometry.coordinates[0].concat(res[annot.properties.name].geometries.features[0].bound)
    xs = s.map(x=>x[0])
    ys =  s.map(x=>x[1])
    // get bounds
    x0 = Math.min.apply(null, xs)
    x1 = Math.max.apply(null, xs)
    y0 = Math.min.apply(null, ys)
    y1 = Math.max.apply(null, ys)
    res[annot.properties.name].geometries.features[0].bound = {type:"Polygon", coordinates: coords}
    // add polygon
    res[annot.properties.name].geometries.features.push({type:"Feature", properties:props, geometry: annot.geometry})
  } else {
    // convert geometry
    annot.geometries = {type:"FeatureCollection", features:[{type:"Feature", properties:props, geometry: annot.geometry}]}
    s = annot.geometry.coordinates[0]
    xs = s.map(x=>x[0])
    ys =  s.map(x=>x[1])
    // get bounds
    x0 = Math.min.apply(null, xs)
    x1 = Math.max.apply(null, xs)
    y0 = Math.min.apply(null, ys)
    y1 = Math.max.apply(null, ys)
    coords = [[[x0,y0], [x0,y1], [x1,y1], [x1,y0], [x0,y0]]]
    annot.geometries.features[0].bound = {type:"Polygon", coordinates: coords}
    // remove old geometry
    delete annot['geometry']
    delete annot['_id']
    res[annot.properties.name] = annot
  }
}
var values = Object.keys(res).map(function(key){
    return res[key];
});
console.log(JSON.stringify(values))
