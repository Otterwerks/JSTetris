# JSTetris

_My own version of the classic puzzle game Tetris._

<br>

Try it out [here](https://otterwerks.github.io/JSTetris) on GitHub Pages. Mobile Friendly!

<br>

<p><img src="icons/javascript.svg" width="50">&nbsp&nbsp&nbsp&nbsp<img src="icons/css-3.svg" width="40">&nbsp&nbsp&nbsp&nbsp<img src="icons/html-5.svg" width="40">&nbsp&nbsp&nbsp&nbsp<img src="icons/nodejs.svg" width="100">&nbsp&nbsp&nbsp&nbsp<img src="icons/express.svg" width="150">&nbsp&nbsp&nbsp&nbsp<img src="icons/mongodb.svg" width="200">&nbsp&nbsp&nbsp&nbsp<img src="icons/raspberry-pi.svg" width="40">&nbsp&nbsp&nbsp&nbsp</p>

<br>

<img src="20190213_111052.jpg" width="400">

## Summary

I decided to do a remake of a classic arcade game as an introduction to JavaScript. I chose to make Tetris because it was always my favorite game as a kid and playing it brings back a great sense of nostalgia. The objective of the game is to maneuver the falling pieces to create full rows of blocks with no gaps when they land at the bottom of the screen. The game ends when the fallen blocks reach the top of the screen.

<br>

## Features
- Responsive, touch friendly
- Progressive difficulty through fall speed and additional bottom row blocks
- Points are assigned at 10 points for a single row, 20 points per row if multiple rows are cleared at once
- High scores loaded from and saved to a remote leaderboard server
- Shadow outline of where the game piece will land

<br>

## Technical
The game can be statically hosted and remains playable independently from the server. The game server will require the dependencies listed below as well as an SSL certificate if the game is loaded from an HTTPS address. I have provided two shell scripts that I wrote to restart the database and clear the database, these should be edited with the appropriate paths for your environment.
**Browsers supporting 8 digit hex colors are required for some animations to display properly, gameplay is not impacted.**

#### Game
- HTML
- CSS
- Javascript

#### Server
- Node JS
- Mongo DB
- Hosted on a Raspberry Pi Zero W

#### Server Dependencies
- Express JS (`npm install express`)
- Mongo JS (`npm install mongojs`)
- Body Parser (`npm install body-parser`)

<br>

## Modifications
The following sections are guidelines for changing parameters that will alter gameplay. The leaderboard function will be unavailable if the game speed or size are modified. If you perform further modifications, please disable the leaderboard by commenting out line 1030 `leaderboard = JSON.parse(xhr.response).leaderboard;`.

#### Game Board Size
The size of the game board grid can be changed on lines 14 and 15 of game.js: `width = 10` and `height = 20` are the default values, where the units are in grid blocks.

#### Game Speed
The game speed can be altered on line 10: `FPS = 30` is the default value. A higher number will result in faster game speed, in frames per second.

#### Color Themes
Add your own color theme by using the following format and inserting the array after line 122: `["#AAAAAA", "#BBBBBB", "#CCCCCC", "#DDDDDD", "#EEEEEE"],`, colors should be set as 6 digit hex values to work properly with animations. Color arrays must have a minimum length of 3 colors and have no maximum length.

<br>

## Resources Used
I devloped this game with the help of the following resources:
- Creating a Pong Game ([link](https://www.udemy.com/code-your-first-game/))
- Creating a Breakout Game ([link](https://developer.mozilla.org/en-US/docs/Games/Tutorials/2D_Breakout_game_pure_JavaScript))
- Using HTML Canvas to Create a Game ([link](https://medium.freecodecamp.org/how-creating-simple-canvas-games-helped-me-6eef839f450e))
- Set Up a Node.JS Server To Add a Leaderboard To Your Game ([link](http://clockworkchilli.com/blog/7_set_up_a_node.js_server_to_add_a_leaderboard_to_your_game))
- [Stackoverflow](https://www.stackoverflow.com) for occasional troubleshooting

