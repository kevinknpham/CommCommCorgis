/**
 * Sets up web socket and handles messages from the server
 */

// Sets up the web socket
let HOST = location.origin.replace(/^http/, 'ws');
let ws = new WebSocket(HOST);

ws.onopen = event => {
  ws.onmessage = msg => handleMessageFromSever(msg.data);
  ws.onclose = event => {
    swal('You are disconnected due to inactivity.').then(value => {
      window.location.reload();
    });
  };
  setChat();
};

/**
 * Takes in the msg and takes an action depending on msg
 * Any exceptions are logged into the console.
 * May throw Syntax Error
 * Returns nothing
 * @param {String} msg
 */
function handleMessageFromSever(msg) {
  console.log(msg);
  try {
    data = JSON.parse(msg, reviver);
    if (data.action) {
      const action = data.action.toLowerCase();

      switch (action) {
        case 'chat': // chat messages
          handleChat(data);
          break;
        case 'move_char': // update character position
          handleMoveChar(data);
          break;
        case 'list': // updates list
          handleList(data);
          break;
        case 'change_room_result': // updates room data
          handleChangeRoomResult(data);
          break;
        case 'login_result': // informs user of login success or failure
          handleLoginResult(data);
          break;
        case 'new_char': // create new character
          handleNewChar(data);
          break;
        case 'modify_char': //modify character appearance
          handleModifyChar(data);
          break;
        case 'remove_char': // remove character from game
          handleRemoveChar(data);
          break;
        default:
          console.log(action + ' is not a valid action');
      }
    }
  } catch (e) {
    error(ws, 'Your request was not JSON formatted.');
  }
}

/**
 *
 * @param {*} key
 * @param {*} value
 * @returns If value is of type Map, returns Map object. Otherwise, returns
 *          value parameter.
 */
function reviver(key, value) {
  if (typeof value === 'object' && value !== null) {
    if (value.dataType === 'Map') {
      return new Map(value.value);
    }
  }
  return value;
}

setUpCharacterSelection();
