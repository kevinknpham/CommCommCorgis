let HOST = location.origin.replace(/^http/, 'ws');
let ws = new WebSocket(HOST);

const STANDARD_WIDTH = 1920;
const STANDARD_HEIGHT = 1080;
const STANDARD_GAME_RATIO = 0.7;
const STANDARD_CHAT_RATIO = 1 - STANDARD_GAME_RATIO;

// Ignore non-16:9 ratio screen
let screenRatio = screen.width / STANDARD_WIDTH;
let inverseScreenRatio = STANDARD_WIDTH / screen.width;

// server to client
function convertStandardSizeToClientSize(measurement) {
  return measurement * screenRatio;
}

// client to server
function convertClientSizeToStandardSize(measurement) {
  return measurement * inverseScreenRatio;
}

function applyConversionToScreen(measurement, ratio) {
  return Math.floor(convertStandardSizeToClientSize(measurement) * ratio);
}

// change the dimension of game screen
const CANVAS = document.getElementById('myCanvas');
CANVAS.style.width = applyConversionToScreen(STANDARD_WIDTH, STANDARD_GAME_RATIO);
CANVAS.style.height = applyConversionToScreen(STANDARD_HEIGHT, STANDARD_GAME_RATIO);

// change the dimension of chat
const CHAT = document.getElementById('chat');

CHAT.style.width = applyConversionToScreen(STANDARD_WIDTH, STANDARD_CHAT_RATIO);
CHAT.style.height = applyConversionToScreen(STANDARD_HEIGHT, STANDARD_GAME_RATIO);


ws.onopen = event => {
  ws.onmessage = msg => handleMessageFromSever(msg.data);
  ws.onclose = event => console.log('ws closed');
  setChat();
};

function handleMessageFromSever(msg) {
  console.log(msg);
  data = JSON.parse(msg);
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
      case 'login_result':
        handleLoginResult(data);
        break;
      case 'new_char': // create new character
        handleNewChar(data);
        break;
      case 'modify_char': //modify charater appearance
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

setUpCharacterSelection();
