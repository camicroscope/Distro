# Migrating Data from QUIP 2.0 to QUIP 3.0

## Annotations

Since the annotation type has changed to allow for more dynamic options, the annotation type has undergone some changes.
Run the tool with `node annots-to-to-3.js annots.json > out.json`, where annots.json is a list of QUIP 2.0 style annotations (see debug-annot.json for a short example).
Use the result with `mongoimport --db camic --collection mark --file out.json --jsonArray` in the ca-mongo container.
