# caMicDist
Camic 2.0 distribution

run with docker-compose -f caMicroscope.yml up

## LIMITATIONS
As of now, please be aware that you need to run config/mongo_idx.js then config/test_seed.js manually.

For future reference, I've seen people write a container just to seed the database, but I'm hesitant to do so.

As of now, since iip does not do good auth checks, neither does this distribution. I'm working on reviving the ensigns (github.com/ensigns/ensign) project to deal with security across the project.



# caMicroscope API Documentation

This document focuses only on the mongo/bindaas endpoints. Other services may comprise caMicroscope, but such services are outside of the scope of this document.

## Mark

A mark is a geospatial object following an extended geojson format.

- get
  - Returns a single mark by its objectid
- find
  - Find marks by name, associated slide, and associated source (noted key)
- findTypes
  - Finds types (noted as provenance in the data model) by name and slide.
- findPoint
  - Finds marks by a given point in x and y coordinates in the same space, and slide and name

## Overlay

An overlay is an image, usually pregenerated, which can be displayed over a slide.

- Get
  - Returns a single overlay by its objectid
- Find
  - Find a overlays by name and type

## Slide

- Get
  - Returns a single slide by its objectid
- Find
  - Find a template or templates by name and type

## Template

- Get
  - Returns a single template by its objectid
- Find
  - Find templates by name and type

