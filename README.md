# Comm Comm Corgis

## Setup
To set up the server run the following:

* `npm install`
* `node server.js` or `npm start`

## Client
By: Jong and Miguel

### Displaying game
DOM manipulation is used to move characters around and to switch screens.

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

`action`: required field.  Describes what the server should do.


if `action` is create

_A character is created and added to the game._
* `name`: name of character
* server will respond with a JSON formatted String with the `action` of 'login_result' and a field `status` that will be 'success' or 'failure'.  If it failed a `reason` field will also be included.

if `action` is change_attribute
* `name`: name of character
* `attributes`: JS Object that has one or more of the following attributes and their new value
    - color: 'none' | 'red' | 'green' | 'blue'

if `action` is update

_The specified character's position is updated._
* `name`: name of character to move
* `x`: x position to move character to
* `y`: y position to move character to

if `action` is leave

_The specified character is removed from the game._
* `name`: name of character leaving

if `action` is chat

_The message is broadcast to all connected users._
* `user`: name of current player
* `text`: body of message

if `action` is list

_The server will respond with a list of the characters and their positions._
* optional field `room`: room to list characters from (if not specified, all rooms' characters are listed)
* server will respond with an JSON formatted String containing an `action` with the value 'list' and a `list` with a value of an array of objects, each containing a 'name', 'x', and 'y' attribute.

**Server message format**

The response will be a JSON formatted String containing an `action` field.

if `action` is chat
* `user`: name of message sender
* `text`: body of message

if `action` is new_char
* `name`: name of new character
* `x`: x coordinate of new character (will start at 0)
* `y`: y coordinate of new character (will start at 0)

if `action` is modify_char
* `name`: name of character to modify
* `attributes`: JS Object that has one or more of the following attributes and their new value
    - color: 'none' | 'red' | 'green' | 'blue'

if `action` is move_char
* `name`: name of character to move
* `x`: new x coordinate
* `y`: new y coordinate

if `action` is remove_char
* `name`: name of character to remove

# Goals

A running to do list can be found [here](https://docs.google.com/spreadsheets/d/1cJMP1YoE9plkKD9wdrVH9x0niO9LTA94-gwFw89f9Ug/edit?usp=sharing).