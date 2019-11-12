var slides = [{
    "_id": new ObjectId("5bec456369056d7e537c2a9b"),
    name: "CMU1",
    location: "/images/sample.svs",
    mpp: 0.499,
    study: '',
    specimen: ''
}]

var marks = [
    {
        "provenance": {
            "image": {
                "slide": "5bec456369056d7e537c2a9b"
            },
            "analysis": {
                "source": "human",
                "execution_id": "Gamma",
                "name": "test 1"
            }
        },
        "properties": {
            "annotations": {
                "name": "test 1",
                "digital_slide_quality": true,
                "histology": "PDAC",
                "hist_other_type": "Colloid carcinoma (mucinous noncystic carcinoma)",
                "cellularity_10": "31-40%",
                "tumor_cellularity": "<20%",
                "tumor_necrosis": "<20%",
                "adequacy": "Adequate",
                "normal_tissue_type": "Duodenum",
                "tumor_present": false,
                "additional_notes": "test note"
            }
        },
        "geometries": {
            "type": "FeatureCollection",
            "features": [
                {
                    "type": "Feature",
                    "properties": {
                        "style": {
                            "color": "#7cfc00",
                            "lineCap": "round",
                            "lineJoin": "round",
                            "lineWidth": 3
                        }
                    },
                    "geometry": {
                        "type": "Polygon",
                        "coordinates": [
                            [
                                [
                                    0,
                                    1.333075238564
                                ],
                                [
                                    0.9211833251318,
                                    1.333075238564
                                ],
                                [
                                    0.9211833251318,
                                    1.4056976389659
                                ],
                                [
                                    0.84856092473,
                                    1.4056976389659
                                ],
                                [
                                    0,
                                    1.333075238564
                                ]
                            ]
                        ]
                    },
                    "bound": {
                        "type": "Polygon",
                        "coordinates": [
                            [
                                [
                                    0.0819138121014,
                                    1.2558071323124
                                ],
                                [
                                    0.987611451067,
                                    1.2558071323124
                                ],
                                [
                                    0.987611451067,
                                    1.9173119035902
                                ],
                                [
                                    0.0819138121014,
                                    1.9173119035902
                                ],
                                [
                                    0.0819138121014,
                                    1.2558071323124
                                ]
                            ]
                        ]
                    }
                }
            ]
        }
    }
];

heatmap_data = []
for (var i = 0; i<1; i+=0.007243258749282846){
  for (var j = 0; j<1; j+=0.010489147367327867){
    heatmap_data.push([i,j,Math.random(),Math.floor(Math.random()*10)])
  }
}


var heatmaps = [{
    "provenance": {
        "image": {
            "slide": "5bec456369056d7e537c2a9b",
        },
        "analysis": {
            "study_id":"test",
            "type": "heatmap",
            "computation": "heatmap",
            "execution_id": "heatmap_test",
            "size": [0.007243258749282846,0.010489147367327867],
            "fields": [{"name":"necrosis", "range":[0,1]}, {"name":"tumor", "range":[0,10]}],
            "coordinateSystem": "image"
        }
    },
    "data": heatmap_data
}]

const annotation_schema = {
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
        },
        "digital_slide_quality": {
            "id": "a1",
            "title": "Check if histology is able to be evaluated",
            "type": "boolean"
        },
        "histology": {
            "id": "a2",
            "title": "Histology: (For BL1 and BL2 only)",
            "type": "string",
            "enum": ["-", "PDAC", "PNET", "other"],
            "default": "-"
        },
        "hist_other_type": {
            "id": "a3",
            "title": "Other Histology: (For BL1 and BL2 only)",
            "type": "string",
            "enum": ["-", "N/A", "Colloid carcinoma (mucinous noncystic carcinoma)", "Signet-ring cell carcinoma", "Adenosquamous carcinoma", "Intraductal papillary-mucinous neoplasm with an associated invasive carcinoma", "Intraductal tubulopapillary neoplasm with an associated invasive carcinoma", "Mucinous cystic neoplasm with an associated invasive carcinoma", "Large cell neuroendocrine carcinoma", "Small cell neuroendocrine carcinoma", "Neuroendocrine carcinoma (poorly differentiated)", "Undifferentiated (anaplastic) carcinoma", "Undifferentiated carcinoma with osteoclast-like giant cells", "Acinar cell carcinoma", "Acinar cell cystadenocarcinoma", "Serous cystadenocarcinoma", "Mixed acinar-ductal carcinoma", "Mixed ductal-neuroendocrine carcinoma", "Mixed acinar-neuroendocrine carcinoma", "Mixed acinar-neuroendocrine-ductal carcinoma", "Solid-pseudopapillary neoplasm", "Hepatoid carcinoma", "Medullary carcinoma"],
            "default": "-"
        },
        "cellularity_10": {
            "id": "a4",
            "title": "Cellularity percentage",
            "type": "string",
            "enum": ["-", "0-10%", "11-20%", "21-30%", "31-40%", "41-50%", "51-60%", "61-70%", "71-80%", "81-90%", "91-100%"],
            "default": "-"
        },
        "tumor_cellularity": {
            "id": "a5",
            "title": "Tumor Cellularity: (For BL1 and BL2 only)",
            "type": "string",
            "enum": ["-", "<20% ", ">=20%"],
            "default": "-"
        },
        "tumor_necrosis": {
            "id": "a6",
            "title": "Tumor Necrosis: (For BL1 and BL2 only)",
            "type": "string",
            "enum": ["-", "<20% ", ">=20%"],
            "default": "-"
        },
        "adequacy": {
            "id": "a7",
            "title": "Adequacy: (For BL1 and BL2 only)",
            "type": "string",
            "enum": ["-", "Adequate", "Inadequate"],
            "default": "-"
        },
        "normal_tissue_type": {
            "id": "a8",
            "title": "Normal Tissue Type: (For BL3 only)",
            "type": "string",
            "enum": ["-", "Duodenum", "Lymph Node", "Spleen", "Other"],
            "default": "-"
        },
        "tumor_present": {
            "id": "a9",
            "title": "Check if tumor present (For BL3 only)",
            "type": "boolean"
        },
        "notes": {
            "id": "a10",
            "title": "Notes: ",
            "type": "string",
            "format":"textarea",
            "maxLength": 128
        }
    }
};

const algorithm_1_schema = {
    "type": "object",
    "id": "algorithm01",
    "name": "Alg1Schema",
    "description": "",
    "links": [],
    "additionalProperties": false,
    "properties": {
        "arg1": {
            "id": "01",
            "title": "Argument 01",
            "type": "boolean"
        },
        "arg2": {
            "id": "02",
            "title": "Argument 02",
            "type": "string",
            "enum": ["arg_01", "arg_02", "arg_03", "arg_04"],
            "default": "-"
        },
        "arg3": {
            "id": "03",
            "title": "Argument 03",
            "type": "textarea"
        }
    }
};
const algorithm_2_schema = {
    "type": "object",
    "id": "algorithm02",
    "name": "Alg1Schema",
    "description": "",
    "links": [],
    "additionalProperties": false,
    "properties": {
        "arg1": {
            "id": "01",
            "title": "Argument 01",
            "type": "boolean"
        },
        "arg2": {
            "id": "02",
            "title": "Argument 02",
            "type": "string",
            "enum": ["arg_01", "arg_02", "arg_03", "arg_04"],
            "default": "-"
        },
        "arg3": {
            "id": "03",
            "title": "Argument 03",
            "type": "boolean"
        },
        "arg4": {
            "id": "04",
            "title": "Argument 04",
            "type": "range"
        },
    }
};

var configs=[{ 
   config_name:"preset_label",
   configuration:[ 
      { 
         title:"Lymph",
         value:"Lymph",
         children:[ 
            { 
               title:"Positive",
               value:"Positive",
               children:[ 
                  { 
                     title:100,
                     value:100,
                     color:"#ff6296",
                     checked:true,
                     data:{ 
                        color:"#ff6296",
                        mode:"grid",
                        type:"Lymph-Positive",
                        size:100
                     }
                  },
                  { 
                     title:"Point",
                     value:"Point",
                     color:"#ff6296",
                     data:{ 
                        color:"#ff6296",
                        mode:"point",
                        type:"Lymph-Positive"
                     }
                  }
               ]
            },
            { 
               title:"Negative",
               value:"Negative",
               children:[ 
                  { 
                     title:100,
                     value:100,
                     color:"#62ffcb",
                     data:{ 
                        color:"#62ffcb",
                        mode:"grid",
                        type:"Lymph-Negative",
                        size:100
                     }
                  },
                  { 
                     title:"Point",
                     value:"Point",
                     color:"#62ffcb",
                     data:{ 
                        color:"#62ffcb",
                        mode:"point",
                        type:"Lymph-Negative"
                     }
                  }
               ]
            }
         ]
      },
      { 
         title:"Neutrophil",
         value:"Neutrophil",
         children:[ 
            { 
               title:"Positive",
               value:"Positive",
               color:"#ffcb62",
               data:{ 
                  color:"#ffcb62",
                  mode:"grid",
                  type:"Neutrophil-Positive",
                  size:50
               }
            },
            { 
               title:"Negative",
               value:"Negative",
               color:"#6296ff",
               data:{ 
                  color:"#6296ff",
                  mode:"grid",
                  type:"Neutrophil-Negative",
                  size:50
               }
            }
         ]
      },
      { 
         title:"Necrosis",
         value:"Necrosis",
         children:[ 
            { 
               title:"Positive",
               value:"Positive",
               children:[ 
                  { 
                     title:100,
                     value:100,
                     color:"#ff00d9",
                     data:{ 
                        color:"#ff00d9",
                        mode:"grid",
                        type:"Necrosis-Positive",
                        size:100
                     }
                  },
                  { 
                     title:500,
                     value:500,
                     color:"#ff00d9",
                     data:{ 
                        color:"#ff00d9",
                        mode:"grid",
                        type:"Necrosis-Positive",
                        size:500
                     }
                  }
               ]
            },
            { 
               title:"Negative",
               value:"Negative",
               children:[ 
                  { 
                     title:100,
                     value:100,
                     color:"#00ff26",
                     data:{ 
                        color:"#00ff26",
                        mode:"grid",
                        type:"Necrosis-Negative",
                        size:100
                     }
                  },
                  { 
                     title:500,
                     value:500,
                     color:"#00ff26",
                     data:{ 
                        color:"#00ff26",
                        mode:"grid",
                        type:"Necrosis-Negative",
                        size:500
                     }
                  }
               ]
            }
         ]
      },
      { 
         title:"Tumor",
         value:"Tumor",
         children:[ 
            { 
               title:"Positive",
               value:"Positive",
               children:[ 
                  { 
                     title:100,
                     value:100,
                     color:"#790cff",
                     data:{ 
                        color:"#790cff",
                        mode:"grid",
                        type:"Tumor-Positive",
                        size:100
                     }
                  },
                  { 
                     title:300,
                     value:300,
                     color:"#790cff",
                     data:{ 
                        color:"#790cff",
                        mode:"grid",
                        type:"Tumor-Positive",
                        size:300
                     }
                  },
                  { 
                     title:1000,
                     value:1000,
                     color:"#790cff",
                     data:{ 
                        color:"#790cff",
                        mode:"grid",
                        type:"Tumor-Positive",
                        size:1000
                     }
                  },
                  { 
                     title:2000,
                     value:2000,
                     color:"#790cff",
                     data:{ 
                        color:"#790cff",
                        mode:"grid",
                        type:"Tumor-Positive",
                        size:2000
                     }
                  }
               ]
            },
            { 
               title:"Negative",
               value:"Negative",
               children:[ 
                  { 
                     title:100,
                     value:100,
                     color:"#92ff0c",
                     data:{ 
                        color:"#92ff0c",
                        mode:"grid",
                        type:"Tumor-Negative",
                        size:100
                     }
                  },
                  { 
                     title:300,
                     value:300,
                     color:"#92ff0c",
                     data:{ 
                        color:"#92ff0c",
                        mode:"grid",
                        type:"Tumor-Negative",
                        size:300
                     }
                  },
                  { 
                     title:1000,
                     value:1000,
                     color:"#92ff0c",
                     data:{ 
                        color:"#92ff0c",
                        mode:"grid",
                        type:"Tumor-Negative",
                        size:1000
                     }
                  },
                  { 
                     title:2000,
                     value:2000,
                     color:"#92ff0c",
                     data:{ 
                        color:"#92ff0c",
                        mode:"grid",
                        type:"Tumor-Negative",
                        size:2000
                     }
                  }
               ]
            }
         ]
      },
      { 
         title:"Prostate",
         value:"Prostate",
         children:[ 
            { 
               title:"Benign",
               value:"Benign",
               color:"#8dd3c7",
               checked:true,
               data:{ 
                  color:"#8dd3c7",
                  mode:"free",
                  type:"Prostate-Benign"
               }
            },
            { 
               title:"Gleason 3",
               value:"Gleason 3",
               color:"#ffffb3",
               data:{ 
                  color:"#ffffb3",
                  mode:"free",
                  type:"Prostate-Gleason 3"
               }
            },
            { 
               title:"Gleason 4",
               value:"Gleason 4",
               color:"#bebada",
               data:{ 
                  color:"#bebada",
                  mode:"free",
                  type:"Prostate-Gleason 4"
               }
            },
            { 
               title:"Gleason 5",
               value:"Gleason 5",
               color:"#fb8072",
               data:{ 
                  color:"#fb8072",
                  mode:"free",
                  type:"Prostate-Gleason 5"
               }
            },
            { 
               title:"Cancer NOS",
               value:"Cancer NOS",
               color:"#80b1d3",
               data:{ 
                  color:"#80b1d3",
                  mode:"free",
                  type:"Prostate-Cancer NOS"
               }
            }
         ]
      },
      { 
         title:"NSCLC",
         value:"NSCLC",
         children:[ 
            { 
               title:"Benign",
               value:"Benign",
               color:"#fdb462",
               data:{ 
                  color:"#fdb462",
                  mode:"free",
                  type:"NSCLC-Benign"
               }
            },
            { 
               title:"Squamous CA",
               value:"Squamous CA",
               color:"#b3de69",
               data:{ 
                  color:"#b3de69",
                  mode:"free",
                  type:"NSCLC-Squamous CA"
               }
            },
            { 
               title:"Adeno CA (all)",
               value:"Adeno CA (all)",
               color:"#fccde5",
               data:{ 
                  color:"#fccde5",
                  mode:"free",
                  type:"NSCLC-Adeno CA (all)"
               }
            },
            { 
               title:"Acinar",
               value:"Acinar",
               color:"#d9d9d9",
               data:{ 
                  color:"#d9d9d9",
                  mode:"free",
                  type:"NSCLC-Acinar"
               }
            },
            { 
               title:"Lapidic",
               value:"Lapidic",
               color:"#bc80bd",
               data:{ 
                  color:"#bc80bd",
                  mode:"free",
                  type:"NSCLC-Lapidic"
               }
            },
            { 
               title:"Solid",
               value:"Solid",
               color:"#ccebc5",
               data:{ 
                  color:"#ccebc5",
                  mode:"free",
                  type:"NSCLC-Solid"
               }
            },
            { 
               title:"Papillary",
               value:"Papillary",
               color:"#ffed6f",
               data:{ 
                  color:"#ffed6f",
                  mode:"free",
                  type:"NSCLC-Papillary"
               }
            },
            { 
               title:"Micropapillary",
               value:"Micropapillary",
               color:"#6a3d9a",
               data:{ 
                  color:"#6a3d9a",
                  mode:"free",
                  type:"NSCLC-Micropapillary"
               }
            }
         ]
      }
   ]
}];






var templates = [algorithm_2_schema, algorithm_1_schema, annotation_schema]
db.slide.insertMany(slides)
db.mark.insertMany(marks)
db.template.insertMany(templates)
//db.authorization.insertMany(auths)
db.heatmap.insertMany(heatmaps)
db.configuration.insertMany(configs)