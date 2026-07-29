// One-time data seed (not a schema migration) for the DICOMweb sources list
// used by camicroscope's apps/dicom-web/table.html "DICOMweb" explorer.
// To run: either expose the mongo port (not recommended for production) or
// `docker exec -it ca-mongo mongosh`, then `use camic`, then load/paste this file.
// Safe to re-run: it upserts the single dicomweb_sources Configuration
// document by config_name rather than inserting duplicates.
//
// Endpoints below are the 2026 IHE Connectathon DICOMweb "Image Manager/
// Archive" origin servers whose Query/Retrieve and Store transactions share a
// single DICOMweb root (the assumption camicroscope's dicom-web explorer and
// viewer make). Vendors that split QIDO-RS/WADO-RS into separate roots
// (Sectra, AGFA), require auth flows the app doesn't support (Visage's JWT),
// or don't expose a browsable Query/Retrieve root at all were intentionally
// left out; add them by hand through the "Add Source" UI if you confirm they
// work.
var dicomwebSources = [
  {id: 'google', name: 'Google', url: 'https://dicomwebproxy.app/dicomWeb'},
  {id: 'bmd', name: 'BMD Software', url: 'https://dicom-wg26.bmd-software.com/ext/dicom-web'},
  {id: 'proscia', name: 'Proscia', url: 'https://proscia-connectathon.com/dicom-web'},
  {id: 'ntunhs', name: 'NTUNHS', url: 'https://raccoon.dicom.org.tw/dicom-web'},
  {id: 'infinitt', name: 'Infinitt', url: 'http://121.170.194.140:88/dicomweb'},
];

db.configuration.updateOne(
    {config_name: 'dicomweb_sources'},
    {$set: {config_name: 'dicomweb_sources', configuration: dicomwebSources}},
    {upsert: true},
);
