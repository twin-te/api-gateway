#!/usr/bin/env bash

mkdir -p ./generated/services
mkdir -p ./generated/services/course
mkdir -p ./generated/services/timetable
mkdir -p ./generated/services/schoolCalendar


### course
yarn pbjs \
  --target static-module \
  --no-encode \
  --no-decode \
  --path ../../ \
  --out generated/services/course/index.js \
  ./services/course-service/protos/CourseService.proto

yarn pbts \
  --out ./generated/services/course/index.d.ts \
  ./generated/services/course/index.js


### https://github.com/protobufjs/protobuf.js/issues/1222
sed -i -e "s/\[ 'Promise' \]\./Promise/g" "generated/services/course/index.d.ts"
sed -i -e "s/\[ 'object' \]\.<string, any>/{ [k: string]: any }/g" "generated/services/course/index.d.ts"
sed -i -e "s/\[ 'Array' \]\./Array/g" "generated/services/course/index.d.ts"
###

### timetable
yarn pbjs \
  --target static-module \
  --no-encode \
  --no-decode \
  --path ../../ \
  --out generated/services/timetable/index.js \
  ./services/timetable-service/protos/Nullable.proto \
  ./services/timetable-service/protos/Message.proto \
  ./services/timetable-service/protos/TimetableService.proto

yarn pbts \
  --out ./generated/services/timetable/index.d.ts \
  ./generated/services/timetable/index.js

### https://github.com/protobufjs/protobuf.js/issues/1222
sed -i -e "s/\[ 'Promise' \]\./Promise/g" "generated/services/timetable/index.d.ts"
sed -i -e "s/\[ 'object' \]\.<string, any>/{ [k: string]: any }/g" "generated/services/timetable/index.d.ts"
sed -i -e "s/\[ 'Array' \]\./Array/g" "generated/services/timetable/index.d.ts"
###

### schoolCalendar
yarn pbjs \
  --target static-module \
  --no-encode \
  --no-decode \
  --path ../../ \
  --out generated/services/schoolCalendar/index.js \
  ./services/school-calendar-service/protos/SchoolCalendarService.proto

yarn pbts \
  --out ./generated/services/schoolCalendar/index.d.ts \
  ./generated/services/schoolCalendar/index.js

### https://github.com/protobufjs/protobuf.js/issues/1222
sed -i -e "s/\[ 'Promise' \]\./Promise/g" "generated/services/schoolCalendar/index.d.ts"
sed -i -e "s/\[ 'object' \]\.<string, any>/{ [k: string]: any }/g" "generated/services/schoolCalendar/index.d.ts"
sed -i -e "s/\[ 'Array' \]\./Array/g" "generated/services/schoolCalendar/index.d.ts"
###