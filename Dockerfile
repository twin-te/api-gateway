FROM node:14-slim AS build-env
WORKDIR /usr/src/app

RUN apt update && apt install git -y

COPY package.json ./
COPY yarn.lock ./
RUN yarn

COPY . .

RUN yarn openapi
RUN yarn proto

RUN yarn build


FROM node:14-alpine
WORKDIR /usr/src/app

LABEL org.opencontainers.image.source https://github.com/twin-te/api-gateway

COPY --from=build-env /usr/src/app/generated ./generated

COPY --from=build-env /usr/src/app/services/course-service/protos/ ./services/course-service/protos/
COPY --from=build-env /usr/src/app/services/timetable-service/protos/ ./services/timetable-service/protos/
COPY --from=build-env /usr/src/app/services/school-calendar-service/protos/ ./services/school-calendar-service/protos/
COPY --from=build-env /usr/src/app/services/donation-service/protos/ ./services/donation-service/protos/

COPY --from=build-env /usr/src/app/openapi-spec/spec.yml ./openapi-spec/
COPY --from=build-env /usr/src/app/dist ./dist
COPY --from=build-env /usr/src/app/package.json .
COPY --from=build-env /usr/src/app/yarn.lock .

RUN apk --no-cache add git

RUN yarn install --prod

RUN apk del --purge git

EXPOSE 3000

CMD ["node", "dist/index.js"]