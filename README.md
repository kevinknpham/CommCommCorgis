# Comm Comm Corgis

## Setup
To set up the server run the following:

* `npm install`
* `node server.js`

## Client
By: Jong and Miguel
Will use React or not

### Displaying game
TBD how to do - could use DOM manipulation

### Controlling game
Will use mouse clicks for user to walk around environment.  Movements will be sent to server using WebSocket.

### Updating game
When server sends info, update position of other players.

## Server
By: Kevin and Sashu
Will use Express.js with WebSockets and (hopefully) PostgreSQL

### Supported commands
For the minimum viable product we want update player location

### Request/Response format
Requests and responses will use JSON format

**Client message format**

Any missing fields will result in a plain text error response.

`action`: what the server should do.  Can be 'update', 'create', 'leave'.

if `action` is create

* `name`: name of character

if `action` is update:

* `name`: name of character to move
* `x`: x position to move character to
* `y`: y position to move character to

if `action` is leave

* `name`: name of character leaving

if `action` is chat

* `user`: name of current player
* `text`: body of message

if `action` is list
* no required fields, server will respond with list of player locations

**Server message format**

The response will be a JSON formatted String containing an `action` field.

if `action` is chat
* `user`: name of message sender
* `text`: body of message

if `action` is new_char
* `name`: name of new character
* `x`: x coordinate of new character (will start at 0)
* `y`: y coordinate of new character (will start at 0)

if `action` is move_char
* `name`: name of character to move
* `x`: new x coordinate
* `y`: new y coordinate

# Goals

A running to do list can be found [here](https://docs.google.com/spreadsheets/d/1cJMP1YoE9plkKD9wdrVH9x0niO9LTA94-gwFw89f9Ug/edit?usp=sharing).