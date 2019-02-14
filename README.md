# JSTetris

My own version of the classic puzzle game Tetris.

<br>

<img src="20190213_111052.jpg" width="400">

## Motivation

I decided to do a remake of a classic arcade game as an introduction to Javascript. I chose to make Tetris because it was always my favorite game as a kid and playing it brings back a great sense of nostalgia.

## Features
- Responsive, mobile friendly
- Progressive difficulty through fall speed and additional bottom row blocks
- High scores loaded from and saved to a leaderboard server
- Shadow outline of where the game piece will land

## Technical
The game can be statically hosted and remains playable independently from the server. The game server will require the dependencies listed below as well as an SSL certificate if the game is loaded from an HTTPS address.
**Browsers supporting 8 digit hex colors are required for some animations to display properly, gameplay is not impacted.**

### Game
- HTML
- CSS
- Javascript

### Server
- Node JS
- Mongo DB

### Server Dependencies
- Express JS (`npm install express`)
- Mongo JS (`npm install mongojs`)
- Body Parser (`npm install body-parser`)

