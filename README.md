How to run
1. On root directory run `$ yarn install` to install API dependencies
2. On `/client` directory run `$ yarn install` to instal front-end dependencies
3. On root directory, run `$ yarn dev` to run with nodemon
4. On `/client` directory run `$ yarn start` to run front end

Deploy to heroku
1. `$ git push heroku master`

The heroku-postbuild command in the root's package.json is run after node modules are installed. This will run another install for front end packages and build the front end.

