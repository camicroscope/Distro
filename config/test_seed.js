var collections = [{name: "testCollection", type: 'slide', contents: []}]
var slides = [{name: "CMU1", location:"somewhere", mpp:0.499}]
var marks = [{marktype:{
  name: "Alpha",
  slide: "CMU1",
  type: "human"
},
"geometry": {
      "type": "Polygon",
      "coordinates":
      [[
         [ 0,0 ],
         [ 0,0.1 ],
         [ 0.1,0.1 ],
         [ 0.1,0 ],
         [ 0,0 ]
      ]]

}
},{marktype:{
  name: "Alpha",
  slide: "CMU1",
  type: "human"
},
"geometry": {
      "type": "Polygon",
      "coordinates":
      [[
         [ 0,0 ],
         [ 0,0.5 ],
         [ 1,0.5 ],
         [ 1,0 ],
         [ 0,0 ]
      ]]

}
},{marktype:{
  name: "Gamma",
  slide: "CMU1",
  type: "human"
},
"geometry": {
      "type": "Polygon",
      "coordinates":
      [[
         [ 0.01,0.01 ],
         [ 0.99,0.99 ],
         [ 0.98,0.98 ],
         [ 0.02,0.02 ],
         [ 0.01,0.01 ]
      ]]

}
}];

const annotation_schema = {
  "type": "object",
  "id": "annotation-form",
  "title": "",
  "description": "",
  "links": [],
  "additionalProperties": false,
  "properties": {
	"digital_slide_quality":
		{
			"title" : "Check if histology is able to be evaluated" ,
			"type" : "boolean"
		} ,
		"histology" :
		{
			"title" : "Histology: (For BL1 and BL2 only)" ,
			"type" : "string" ,
			"enum" : [ "-" , "PDAC" , "PNET" , "other"],
			"default" : "-"
		} ,
		"hist_other_type" :
		{
			"title" : "Other Histology: (For BL1 and BL2 only)" ,
			"type" : "string" ,
			"enum" : [ "-" , "N/A" , "Colloid carcinoma (mucinous noncystic carcinoma)" , "Signet-ring cell carcinoma" , "Adenosquamous carcinoma" , "Intraductal papillary-mucinous neoplasm with an associated invasive carcinoma" , "Intraductal tubulopapillary neoplasm with an associated invasive carcinoma" , "Mucinous cystic neoplasm with an associated invasive carcinoma" , "Large cell neuroendocrine carcinoma" , "Small cell neuroendocrine carcinoma" , "Neuroendocrine carcinoma (poorly differentiated)" , "Undifferentiated (anaplastic) carcinoma" , "Undifferentiated carcinoma with osteoclast-like giant cells" , "Acinar cell carcinoma" , "Acinar cell cystadenocarcinoma" , "Serous cystadenocarcinoma" , "Mixed acinar-ductal carcinoma" , "Mixed ductal-neuroendocrine carcinoma" , "Mixed acinar-neuroendocrine carcinoma" , "Mixed acinar-neuroendocrine-ductal carcinoma" , "Solid-pseudopapillary neoplasm" , "Hepatoid carcinoma" , "Medullary carcinoma"],
			"default" : "-"
		} ,
		"cellularity_10" :
		{
			"title" : "Cellularity percentage" ,
			"type" : "string" ,
			"enum" : [ "-" , "0-10%" , "11-20%" , "21-30%" , "31-40%" , "41-50%" , "51-60%" , "61-70%" , "71-80%" , "81-90%" , "91-100%"],
			"default" : "-"
		} ,
		"tumor_cellularity" :
		{
			"title" : "Tumor Cellularity: (For BL1 and BL2 only)" ,
			"type" : "string" ,
		"enum" : [ "-" , "<20% " , ">=20%"],
		"default" : "-"
		} ,
		"tumor_necrosis" :
		{
			"title" : "Tumor Necrosis: (For BL1 and BL2 only)" , "type" : "string" ,
			"enum" : [ "-" , "<20% " , ">=20%"],
			"default" : "-"
		} ,
		"adequacy" :
		{
			"title" : "Adequacy: (For BL1 and BL2 only)" ,
			"type" : "string" ,
			"enum" : [ "-" , "Adequate" , "Inadequate"],
			"default" : "-"
		} ,
		"normal_tissue_type" :
		{
			"title" : "Normal Tissue Type: (For BL3 only)" ,
			"type" : "string" ,
			"enum" : [ "-" , "Duodenum" , "Lymph Node" , "Spleen" , "Other"],
			"default" : "-"
		} ,
		"tumor_present" :
		{
			"title" : "Check if tumor present (For BL3 only)" ,
			"type" : "boolean"
		} ,
		"additional_notes" : {
			"title" : "Additional notes: " , "type" : "radio"
		}
  }
};

const algorithm_1_schema = {
  "type": "object",
  "id": "algorithm01",
  "title": "",
  "description": "",
  "links": [],
  "additionalProperties": false,
  "properties": {
	"arg1":
		{
			"title" : "Argument 01" ,
			"type" : "boolean"
		} ,
		"arg2" :
		{
			"title" : "Argument 02" ,
			"type" : "string" ,
			"enum" : [ "arg_01" , "arg_02" , "arg_03" , "arg_04"],
			"default" : "-"
		} ,
		"arg3" : {
			"title" : "Argument 03" , "type" : "textarea"
		}
  }
};
const algorithm_2_schema = {
  "type": "object",
  "id": "algorithm02",
  "title": "",
  "description": "",
  "links": [],
  "additionalProperties": false,
  "properties": {
	"arg1":
		{
			"title" : "Argument 01" ,
			"type" : "boolean"
		} ,
		"arg2" :
		{
			"title" : "Argument 02" ,
			"type" : "string" ,
			"enum" : [ "arg_01" , "arg_02" , "arg_03" , "arg_04"],
			"default" : "-"
		} ,
		"arg3":
		{
			"title" : "Argument 03" ,
			"type" : "boolean"
		} ,
		"arg4":
		{
			"title" : "Argument 04" ,
			"type" : "range"
		} ,
  }
};





var templates = [algorithm_2_schema,algorithm_1_schema, annotation_schema]

db.collection.insertMany(collections)
db.slide.insertMany(slides)
db.mark.insertMany(marks)
db.template.insertMany(templates)
