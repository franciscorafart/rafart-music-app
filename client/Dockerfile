## Only used for development  ##
FROM node:16
LABEL maintainer="Francisco Rafart <francisco.rafart@gmail.com>"

WORKDIR /app

RUN apt-get update && \
    apt-get install -qq -y build-essential nodejs yarn

COPY package*.json ./
RUN yarn install

COPY . .

EXPOSE 3000

CMD ["yarn", "start"]
