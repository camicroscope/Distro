let defaultTemplate = {
    "_id": "0",
    "type": "object",
    "id": "annotation-form",
    "name": "AnnotSchema",
    "description": "",
    "links": [],
    "additionalProperties": false,
    "properties": {
        "name": {
            "id": "a0",
            "title": "Identity Name",
            "type": "string",
            "required": true,
            "description": "note name"
            },"notes": {
            "id": "a1",
            "title": "Notes: ",
            "type": "string",
            "format":"textarea",
            "maxLength": 128
        }
    }
}

db.template.insert(defaultTemplate)

var defaultConfigs=[{
	"configuration" : [
		{
			"color" : "#ff6296",
			"mode" : "grid",
			"type" : "Lymph-Positive",
			"size" : 100,
			"key" : "1"
		},
		{
			"color" : "#ff6296",
			"mode" : "point",
			"type" : "Lymph-Positive",
			"key" : "2"
		},
		{
			"color" : "#62ffcb",
			"mode" : "grid",
			"type" : "Lymph-Negative",
			"size" : 100,
			"key" : "3"
		},
		{
			"color" : "#62ffcb",
			"mode" : "point",
			"type" : "Lymph-Negative",
			"key" : "4"
		},
		{
			"color" : "#ffcb62",
			"mode" : "grid",
			"type" : "Neutrophil-Positive",
			"size" : 50,
			"key" : "5"
		},
		{
			"color" : "#6296ff",
			"mode" : "grid",
			"type" : "Neutrophil-Negative",
			"size" : 50,
			"key" : "6"
		},
		{
			"color" : "#ff00d9",
			"mode" : "grid",
			"type" : "Necrosis-Positive",
			"size" : 100,
			"key" : "7"
		},
		{
			"color" : "#ff00d9",
			"mode" : "grid",
			"type" : "Necrosis-Positive",
			"size" : 500,
			"key" : "8"
		},
		{
			"color" : "#00ff26",
			"mode" : "grid",
			"type" : "Necrosis-Negative",
			"size" : 100,
			"key" : "9"
		},
		{
			"color" : "#00ff26",
			"mode" : "grid",
			"type" : "Necrosis-Negative",
			"size" : 500,
			"key" : "0"

		},
		{
			"color" : "#790cff",
			"mode" : "grid",
			"type" : "Tumor-Positive",
			"size" : 100,
			"key" : "b"
		},
		{
			"color" : "#790cff",
			"mode" : "grid",
			"type" : "Tumor-Positive",
			"size" : 300,
			"key" : "c"
		},
		{
			"color" : "#790cff",
			"mode" : "grid",
			"type" : "Tumor-Positive",
			"size" : 1000,
			"key" : "d"
		},
		{
			"color" : "#790cff",
			"mode" : "grid",
			"type" : "Tumor-Positive",
			"size" : 2000,
			"key" : "e"
		},
		{
			"color" : "#92ff0c",
			"mode" : "grid",
			"type" : "Tumor-Negative",
			"size" : 100,
			"key" : "f"	
		},
		{
			"color" : "#92ff0c",
			"mode" : "grid",
			"type" : "Tumor-Negative",
			"size" : 300,
			"key" : "g"
		},
		{
			"color" : "#92ff0c",
			"mode" : "grid",
			"type" : "Tumor-Negative",
			"size" : 1000,
			"key" : "h"	
		},
		{
			"color" : "#92ff0c",
			"mode" : "grid",
			"type" : "Tumor-Negative",
			"size" : 2000,
			"key" : "i"			
		}, {
			"color" : "#8dd3c7",
			"mode" : "free",
			"type" : "Prostate-Benign",
			"key" : "j"
		}, {
			"color" : "#ffffb3",
			"mode" : "free",
			"type" : "Prostate-Gleason3",
			"key" : "k"
		}, {
			"color" : "#bebada",
			"mode" : "free",
			"type" : "Prostate-Gleason4",
			"key" : "l"	
		}, {
			"color" : "#fb8072",
			"mode" : "free",
			"type" : "Prostate-Gleason5",
			"key" : "n"
		}, {
			"color" : "#80b1d3",
			"mode" : "free",
			"type" : "Prostate-CancerNOS",
			"key" : "o"
		}, {
			"color" : "#fdb462",
			"mode" : "free",
			"type" : "NSCLC-Benign",
			"key" : "p"
		}, {
			"color" : "#b3de69",
			"mode" : "free",
			"type" : "NSCLC-SquamousCA",
			"key" : "q"
		}, {
			"color" : "#fccde5",
			"mode" : "free",
			"type" : "NSCLC-AdenoCA(all)",
			"key" : "t"
		}, {
			"color" : "#d9d9d9",
			"mode" : "free",
			"type" : "NSCLC-Acinar",
			"key" : "u"
		}, {
			"color" : "#bc80bd",
			"mode" : "free",
			"type" : "NSCLC-Lapidic",
			"key" : "v"
		}, {
			"color" : "#ccebc5",
			"mode" : "free",
			"type" : "NSCLC-Solid",
			"key" : "w"
		}, {
			"color" : "#ffed6f",
			"mode" : "free",
			"type" : "NSCLC-Papillary",
			"key" : "x"
		}, {
			"color" : "#6a3d9a",
			"mode" : "free",
			"type" : "NSCLC-Micropapillary",
			"key" : "y"
		}
	],
	"config_name" : "preset_label"
}];

db.configuration.insertMany(defaultConfigs)
