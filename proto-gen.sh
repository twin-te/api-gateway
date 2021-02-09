#!/usr/bin/env bash

mkdir -p ./generated/services
mkdir -p ./generated/services/course
mkdir -p ./generated/services/timetable


### course
yarn pbjs \
    --target static-module \
    --out generated/services/course/index.js \
    ./services/course-service/protos/CourseService.proto

yarn pbts \
    --out ./generated/services/course/index.d.ts \
    ./generated/services/course/index.js

### timetable
yarn pbjs \
    --target static-module \
    --out generated/services/timetable/index.js \
    ./services/timetable-service/protos/Nullable.proto \
    ./services/timetable-service/protos/Message.proto \
    ./services/timetable-service/protos/TimetableService.proto

yarn pbts \
    --out ./generated/services/timetable/index.d.ts \
    ./generated/services/timetable/index.js
