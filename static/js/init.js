let HOST = location.origin.replace(/^http/, 'ws');
let ws = new WebSocket(HOST);

ws.onopen = event => {
  ws.onmessage = msg => handleMessageFromSever(msg.data);
  ws.onclose = event => {
    // console.log('ws closed');
    swal('You are disconnected due to inactivity.', {
      buttons: {
        ok: 'OK'
      }
    });
    window.location.reload();
  };
  setChat();
};

function handleMessageFromSever(msg) {
  console.log(msg);
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
      case 'list':
        handleList(data);
        break;
      case 'change_room_result':
        handleChangeRoomResult(data);
        break;
      case 'login_result':
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
}

function reviver(key, value) {
  if (typeof value === 'object' && value !== null) {
    if (value.dataType === 'Map') {
      return new Map(value.value);
    }
  }
  return value;
}

setUpCharacterSelection();
