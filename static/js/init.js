let HOST = location.origin.replace(/^http/, 'ws');
let ws = new WebSocket(HOST);

console.log(screen.width + " first");
console.log(screen.height + " first");

// const STANDARD_WIDTH = 1920;
// const STANDARD_HEIGHT = 1080;
// const GAME_RATIO = 0.754;
// const CHAT_RATIO = 1 - GAME_RATIO;

// Ignore non-16:9 ratio screen
// let screenRatio = screen.height / STANDARD_HEIGHT;
// let inverseScreenRatio = STANDARD_HEIGHT / screen.height;

const USER_SCREEN_WIDTH = screen.width;
const USER_SCREEN_HEIGHT = screen.height;
const GAME_RATIO_WIDTH = USER_SCREEN_WIDTH * 0.7;
const CHAT_RATIO_WIDTH = USER_SCREEN_WIDTH * 0.3;
// const GAME_RATIO_HEIGHT = USER_SCREEN_HEIGHT * 0.7; // Useless
const CHAT_RATIO_HEIGHT =   GAME_RATIO_WIDTH * 658 / 1060;
console.log(GAME_RATIO_WIDTH);
// console.log(GAME_RATIO_HEIGHT);

// server to client
// function convertStandardSizeToClientSize(measurement) {
//   return measurement * screenRatio;
// }

// // client to server
// function convertClientSizeToStandardSize(measurement) {
//   return measurement * inverseScreenRatio;
// }

// function applyConversionToScreen(measurement, ratio) {
//   return Math.floor(convertStandardSizeToClientSize(measurement) * ratio);
// }

// change the dimension of game screen
const CANVAS = document.getElementById('myCanvas');
// CANVAS.style.width = `${applyConversionToScreen(STANDARD_WIDTH, GAME_RATIO)}px`;
// CANVAS.style.height = `${applyConversionToScreen(STANDARD_HEIGHT, GAME_RATIO)}px`;

CANVAS.style.width = `${GAME_RATIO_WIDTH}px`;
// CANVAS.style.height = `${GAME_RATIO_HEIGHT}px`;

// console.log(`${applyConversionToScreen(STANDARD_WIDTH, GAME_RATIO)}px`);
// console.log(`${applyConversionToScreen(STANDARD_HEIGHT, GAME_RATIO)}px`);

// change the dimension of chat
const CHAT = document.getElementById('chat');
// CHAT.style.width = `${applyConversionToScreen(STANDARD_WIDTH, CHAT_RATIO)}px`;
// CHAT.style.height = `${applyConversionToScreen(STANDARD_HEIGHT, GAME_RATIO)}px`;
CHAT.style.width = `${CHAT_RATIO_WIDTH}px`;
CHAT.style.height = `${CHAT_RATIO_HEIGHT}px`;


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
