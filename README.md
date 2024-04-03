# About

This app contains different web applications I've used with my music project Rafart
https://app.rafartmusic.com

At the moment I'm developing it to create a central hub for an artist, that will include a fan portal with access to exclusive content.

## 1. The Alienation Dance

The Alienation Dance is a web interactive song experience. You can play a song and mix it in real-time by dragging the instrument icons on the page. Up-down movement controls volume, while left-right movement controls panning. It built it using React, Node, AWS, and the WebAudio API. In addition, the experience includes some custom-made visuals. https://app.rafartmusic.com/alienation-dance

## 2. The Great Refusal

This is a simple video streaming app for The Great Refusal, an audiovisual music performance funded by The Live Arts Boston grant by the Boston Foundation. I built this tool to wrap a youtube live performance stream during the pandemic to get remote donations from the audience. I made it using Stripe and Node. https://app.rafartmusic.com/the-great-refusal

## How to run locally

Currently the app runs with a serverless lambda backend, cureently I'm migrating it to use a node express backend. Do this:

1. On `/client` directory run `$ yarn install` to instal front-end dependencies
2. On `./client` directory, run `$ yarn dev` to run with nodemon

## Deployment notes

- _redirects file neede in public dir with `_/\* /index.html 200` for React Router to work on Netlify
- `NODE_OPTIONS='--openssl-legacy-provider'` needed on build script to avoid error on Netlify build
