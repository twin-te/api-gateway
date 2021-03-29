#!/usr/bin/env bash

mkdir -p ./generated/services
mkdir -p ./generated/services/course
mkdir -p ./generated/services/timetable
mkdir -p ./generated/services/schoolCalendar
mkdir -p ./generated/services/donation
mkdir -p ./generated/services/information
mkdir -p ./generated/services/session


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

### donation
yarn pbjs \
  --target static-module \
  --no-encode \
  --no-decode \
  --path ../../ \
  --out generated/services/donation/index.js \
  ./services/donation-service/protos/DonationService.proto

yarn pbts \
  --out ./generated/services/donation/index.d.ts \
  ./generated/services/donation/index.js

### https://github.com/protobufjs/protobuf.js/issues/1222
sed -i -e "s/\[ 'Promise' \]\./Promise/g" "generated/services/donation/index.d.ts"
sed -i -e "s/\[ 'object' \]\.<string, any>/{ [k: string]: any }/g" "generated/services/donation/index.d.ts"
sed -i -e "s/\[ 'Array' \]\./Array/g" "generated/services/donation/index.d.ts"
###

### information
yarn pbjs \
  --target static-module \
  --no-encode \
  --no-decode \
  --path ../../ \
  --out generated/services/information/index.js \
  ./services/information-service/protos/InformationService.proto

yarn pbts \
  --out ./generated/services/information/index.d.ts \
  ./generated/services/information/index.js

### https://github.com/protobufjs/protobuf.js/issues/1222
sed -i -e "s/\[ 'Promise' \]\./Promise/g" "generated/services/information/index.d.ts"
sed -i -e "s/\[ 'object' \]\.<string, any>/{ [k: string]: any }/g" "generated/services/information/index.d.ts"
sed -i -e "s/\[ 'Array' \]\./Array/g" "generated/services/information/index.d.ts"
###

### session
yarn pbjs \
  --target static-module \
  --no-encode \
  --no-decode \
  --path ../../ \
  --out generated/services/session/index.js \
  ./services/session-service/protos/SessionService.proto

yarn pbts \
  --out ./generated/services/session/index.d.ts \
  ./generated/services/session/index.js

### https://github.com/protobufjs/protobuf.js/issues/1222
sed -i -e "s/\[ 'Promise' \]\./Promise/g" "generated/services/session/index.d.ts"
sed -i -e "s/\[ 'object' \]\.<string, any>/{ [k: string]: any }/g" "generated/services/session/index.d.ts"
sed -i -e "s/\[ 'Array' \]\./Array/g" "generated/services/session/index.d.ts"
###