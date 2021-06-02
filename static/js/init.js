let HOST = location.origin.replace(/^http/, 'ws');
let ws = new WebSocket(HOST);

console.log(screen.width + " first");
console.log(screen.height + " first");



// change the dimension of game screen
const CANVAS = document.getElementById('myCanvas');

const USER_SCREEN_WIDTH = window.innerWidth;
const USER_SCREEN_HEIGHT = window.innerHeight;

console.log(USER_SCREEN_HEIGHT + " USER_SCREEN_HEIGHT");
console.log(USER_SCREEN_WIDTH + " USER_SCREEN_WIDTH");

const CALCULATED_GAME_WIDTH = USER_SCREEN_WIDTH * 0.7;
const CALCULATED_CHAT_WIDTH = USER_SCREEN_WIDTH * 0.3;
const CALCULATED_GAME_HEIGHT = Math.min(CALCULATED_GAME_WIDTH * 468 / 740, USER_SCREEN_HEIGHT - 20);


// server to client
const screenRatio = USER_SCREEN_WIDTH / 1920;
// function convertStandardSizeToClientSize(measurement) {
//   return measurement * screenRatio;
// }

// // client to server
// function convertClientSizeToStandardSize(measurement) {
//   return measurement * inverseScreenRatio;
// }

function applyConversionToScreen(measurement) {
  return Math.floor(measurement * screenRatio);
}


// CANVAS.style.width = `${applyConversionToScreen(STANDARD_WIDTH, GAME_RATIO)}px`;
// CANVAS.style.height = `${applyConversionToScreen(STANDARD_HEIGHT, GAME_RATIO)}px`;

CANVAS.style.width = `${CALCULATED_GAME_WIDTH}px`;
CANVAS.style.height = `${CALCULATED_GAME_HEIGHT}px`;


// console.log(`${applyConversionToScreen(STANDARD_WIDTH, GAME_RATIO)}px`);
// console.log(`${applyConversionToScreen(STANDARD_HEIGHT, GAME_RATIO)}px`);

// change the dimension of chat
const CHAT = document.getElementById('chat');

const CALCULATED_CHAT_HEIGHT = CALCULATED_GAME_HEIGHT;
console.log(window.getComputedStyle(CANVAS).height + " window");
console.log(CALCULATED_CHAT_HEIGHT + " RATIO");
// CHAT.style.width = `${applyConversionToScreen(STANDARD_WIDTH, CHAT_RATIO)}px`;
// CHAT.style.height = `${applyConversionToScreen(STANDARD_HEIGHT, GAME_RATIO)}px`;
CHAT.style.width = `${CALCULATED_CHAT_WIDTH}px`;
CHAT.style.height = `${CALCULATED_CHAT_HEIGHT}px`;
console.log(CHAT.style.height + " CHAT STYLE HEIGHT");


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
