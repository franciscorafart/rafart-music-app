# Legacy app
How to run
1. On root directory run `$ yarn install` to install API dependencies
2. On `/client` directory run `$ yarn install` to instal front-end dependencies
3. On root directory, run `$ yarn dev` to run with nodemon
4. On `/client` directory run `$ yarn start` to run front end

Deploy to heroku
1. `$ git push heroku master`

The heroku-postbuild command in the root's package.json is run after node modules are installed. This will run another install for front end packages and build the front end.

# Dockerized app
1. Run `$ docker-compose up -d`

References:
- Setting up react / Node backend app in Docker
https://towardsdatascience.com/deploying-a-react-nodejs-application-with-docker-part-i-of-ii-910bc6edb46e

- Dockerize a Node app
https://nodejs.org/en/docs/guides/nodejs-docker-webapp/

- Excluding node modules on file mapping
https://medium.com/@semur.nabiev/how-to-make-docker-compose-volumes-ignore-the-node-modules-directory-99f9ec224561

Useful commands:
`$ docker images` => List images
`$ docker image prune -a` => Delete unused images
`$ docker image prune -a` => Remove all images that don't ahve at least 1 container attached
`$ docker ps -a` => List containers
`$ docker logs` => Logs of container
`$ docker container prune` => Delete all stopped containers
`$ docker-compose build` => build
`$ docker-compose up` => Run everything
`$ docker-compose ps` => List running cointainers
