# caMicDist
Camic 2.0 distribution

run with docker-compose -d -f caMiroscope.yml up

## LIMITATIONS
As of now, please be aware that you need to run config/mongo_idx.js then config/test_seed.js manually.

For future reference, I've seen people write a container just to seed the database, but I'm hesitant to do so.

As of now, since iip does not do good auth checks, neither does this distribution. I'm working on reviving the ensigns (github.com/ensigns/ensign) project to deal with security across the project.
