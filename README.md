# JSTetris

_My own version of the classic puzzle game Tetris._

<br>

<img src="20190213_111052.jpg" width="400">

## Summary

I decided to do a remake of a classic arcade game as an introduction to Javascript. I chose to make Tetris because it was always my favorite game as a kid and playing it brings back a great sense of nostalgia. The objective of the game is to maneuver the falling pieces to create full rows of blocks with no gaps at the bottom of the screen. The game ends when the fallen blocks reach the top of the screen.

<br>

## Features
- Responsive, touch friendly
- Progressive difficulty through fall speed and additional bottom row blocks
- Points are assigned at 10 points for a single row, 20 points per row if multiple rows are cleared at once
- High scores loaded from and saved to a leaderboard server
- Shadow outline of where the game piece will land

<br>

## Technical
The game can be statically hosted and remains playable independently from the server. The game server will require the dependencies listed below as well as an SSL certificate if the game is loaded from an HTTPS address.
**Browsers supporting 8 digit hex colors are required for some animations to display properly, gameplay is not impacted.**

#### Game
- HTML
- CSS
- Javascript

#### Server
- Node JS
- Mongo DB

#### Server Dependencies
- Express JS (`npm install express`)
- Mongo JS (`npm install mongojs`)
- Body Parser (`npm install body-parser`)

<br>

## Resources Used
I devloped this game with the help of the following resources:
- Creating a Pong Game ([link](https://www.udemy.com/code-your-first-game/))
- Creating a Breakout Game ([link](https://developer.mozilla.org/en-US/docs/Games/Tutorials/2D_Breakout_game_pure_JavaScript))
- Using HTML Canvas to Create a Game ([link](https://medium.freecodecamp.org/how-creating-simple-canvas-games-helped-me-6eef839f450e))
- Set Up a Node.JS Server To Add a Leaderboard To Your Game ([link](http://clockworkchilli.com/blog/7_set_up_a_node.js_server_to_add_a_leaderboard_to_your_game))
- [Stackoverflow](https://www.stackoverflow.com) for occasional troubleshooting

<br>

## Modifications
The following sections are guidelines for changing parameters that will alter gameplay.

#### Game Board Size
_coming soon_

#### Difficulty
_coming soon_

#### Piece Probability
_coming soon_

#### Scoring
_coming soon_

#### Color Themes
_coming soon_

