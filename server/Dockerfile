FROM node:16-alpine3.14
WORKDIR "/app"
COPY ./package.json ./yarn.lock ./
RUN yarn install
COPY . .
EXPOSE 3131
CMD ["yarn", "start"]
