var collections = [{
    name: "testCollection",
    type: 'slide',
    contents: []
}]
var slides = [{
    name: "CMU1",
    location: "/img/sample.dzi",
    mpp: 0.499
}]
var auths = [{
    name: "CMU",
    slides: ["CMU1"]
}]
var marks = [{
    "provenance": {
        "image": {
            "slide": "CMU1"
        },
        "analysis": {
            "source": "human",
            "execution_id": "Alpha"
        }
    },
    }
    "geometry": [{
        "type": "Polygon",
        "coordinates": [
            [
                [0, 0],
                [0, 0.1],
                [0.1, 0.1],
                [0.1, 0],
                [0, 0]
            ]
        ]

    }],
}, {
    "provenance": {
        "image": {
            "slide": "CMU1"
        },
        "analysis": {
            "source": "human",
            "execution_id": "Alpha"
        }
    },
    "geometry": [{
        "type": "Polygon",
        "coordinates": [
            [
                [0, 0],
                [0, 0.5],
                [1, 0.5],
                [1, 0],
                [0, 0]
            ]
        ]

    }],
}, {
    "provenance": {
        "image": {
            "slide": "CMU1"
        },
        "analysis": {
            "source": "human",
            "execution_id": "Gamma"
        }
    },
    "geometry": [{
        "type": "Polygon",
        "coordinates": [
            [
                [0.01, 0.01],
                [0.99, 0.99],
                [0.98, 0.98],
                [0.02, 0.02],
                [0.01, 0.01]
            ]
        ]

    }]
}];

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
        "additional_notes": {
            "id": "a10",
            "title": "Additional notes: ",
            "type": "radio"
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




var templates = [algorithm_2_schema, algorithm_1_schema, annotation_schema]

db.collection.insertMany(collections)
db.slide.insertMany(slides)
db.mark.insertMany(marks)
db.template.insertMany(templates)
db.authorization.insertMany(auths)
