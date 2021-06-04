let HOST = location.origin.replace(/^http/, 'ws');
let ws = new WebSocket(HOST);

// console.log(screen.width + ' first');
// console.log(screen.height + ' first');

// change the dimension of game screen
const STANDARD_WIDTH = 1920;
const STANDARD_HEIGHT = 1080;

const STANDARD_HEIGHT_TO_WIDTH = STANDARD_HEIGHT / STANDARD_WIDTH;
const STANDARD_WIDTH_TO_HEIGHT = STANDARD_WIDTH / STANDARD_HEIGHT;

const USER_SCREEN_WIDTH = window.innerWidth;
const USER_SCREEN_HEIGHT = window.innerHeight;

const USER_SCREEN_RATIO = USER_SCREEN_HEIGHT / USER_SCREEN_WIDTH;
const USER_TO_STANDARD_RATIO = USER_SCREEN_HEIGHT / STANDARD_HEIGHT;
const STANDARD_TO_USER_RATIO = STANDARD_HEIGHT / USER_SCREEN_HEIGHT;

console.log(USER_SCREEN_HEIGHT + ' USER_SCREEN_HEIGHT');
console.log(USER_SCREEN_WIDTH + ' USER_SCREEN_WIDTH');

console.log(USER_TO_STANDARD_RATIO);

// this idea below is using screen resolution ratio to setting width and height of both game and chat
// first we have standard game and chat size
// second based on ratio, if it is 16:9 (standard), scale it by the ratio of screen width to standard width (1920)

// let temp_game_height;
// let temp_game_width;
// let temp_chat_height;
// let temp_chat_width;
// if (USER_SCREEN_RATIO === STANDARD_HEIGHT_TO_WIDTH) {
//   // e.g) 16:9
//   temp_game_height = STANDARD_HEIGHT * USER_TO_STANDARD_RATIO * 0.9;
//   temp_chat_height = temp_game_height;

//   temp_game_width = (temp_game_height * 740) / 468;
//   temp_chat_width = USER_SCREEN_WIDTH - temp_game_width;
// } else if (USER_SCREEN_RATIO > STANDARD_HEIGHT_TO_WIDTH) {
//   // e.g) 4:3
//   temp_game_height = 0.9 * USER_SCREEN_WIDTH * STANDARD_HEIGHT_TO_WIDTH;
//   temp_chat_height = temp_game_height;

//   temp_game_width = (temp_game_height * 740) / 468;
//   temp_chat_width = USER_SCREEN_WIDTH - temp_game_width;
// } else {
//   // e.g) 21:9
//   temp_game_height = STANDARD_HEIGHT * USER_TO_STANDARD_RATIO * 0.9;
//   temp_chat_height = temp_game_height;

//   temp_game_width = (temp_game_height * 740) / 468;
//   temp_chat_width = STANDARD_WIDTH * USER_TO_STANDARD_RATIO - temp_game_width;
// }

let temp_content_width;
let temp_content_height;

if (USER_SCREEN_RATIO === STANDARD_HEIGHT_TO_WIDTH) {
  // e.g. 16:9 ratio
  temp_content_height = STANDARD_HEIGHT * USER_TO_STANDARD_RATIO;
  temp_content_width = STANDARD_WIDTH * USER_TO_STANDARD_RATIO;
} else if (USER_SCREEN_RATIO > STANDARD_HEIGHT_TO_WIDTH) {
  // e.g. 4:3 ratio
  temp_content_height = USER_SCREEN_WIDTH * STANDARD_HEIGHT_TO_WIDTH;
  temp_content_width = USER_SCREEN_WIDTH;
} else {
  // e.g. 21:9 ratio
  temp_content_height = STANDARD_HEIGHT * USER_TO_STANDARD_RATIO;
  temp_content_width = STANDARD_WIDTH * USER_TO_STANDARD_RATIO;
}

console.log(temp_content_width + ' CONTENT WIDTH');
console.log(temp_content_height + ' CONTENT HEIGHT');

const CONTENT = document.getElementById('content');
CONTENT.style.width = `${temp_content_width}px`;
CONTENT.style.height = `${temp_content_height}px`;

const CANVAS = document.getElementById('myCanvas');
const CHAT = document.getElementById('chat');

let game_height = temp_content_height * 0.9;
let chat_height = game_height;

let game_width = (game_height * 740) / 468;
let chat_width = temp_content_width - game_width - 10;

console.log(game_width + ' GAME WIDTH');
console.log(game_height + ' GAME HEIGHT');

console.log(chat_width + ' CHAT WIDTH');
console.log(chat_height + ' CHAT HEIGHT');

CANVAS.style.width = `${game_width}px`;
CANVAS.style.height = `${game_height}px`;

CHAT.style.width = `${chat_width}px`;
CHAT.style.height = `${chat_height}px`;

// const CALCULATED_GAME_HEIGHT = temp_game_height;
// const CALCULATED_GAME_WIDTH = temp_game_width;
// const CALCULATED_CHAT_HEIGHT = temp_chat_height;
// const CALCULATED_CHAT_WIDTH = temp_chat_width;

// console.log(CALCULATED_CHAT_HEIGHT + ' CHAT HEIGHT');
// console.log(CALCULATED_GAME_WIDTH + ' GAME WIDTH');
// console.log(CALCULATED_CHAT_WIDTH + ' CHAT WIDTH');

// CANVAS.style.width = `${CALCULATED_GAME_WIDTH}px`;
// CANVAS.style.height = `${CALCULATED_GAME_HEIGHT}px`;

// console.log(`${applyConversionToScreen(STANDARD_WIDTH, GAME_RATIO)}px`);
// console.log(`${applyConversionToScreen(STANDARD_HEIGHT, GAME_RATIO)}px`);

// change the dimension of chat

// console.log(window.getComputedStyle(CANVAS).height + ' window');
// console.log(CALCULATED_CHAT_HEIGHT + ' RATIO');
// CHAT.style.width = `${applyConversionToScreen(STANDARD_WIDTH, CHAT_RATIO)}px`;
// CHAT.style.height = `${applyConversionToScreen(STANDARD_HEIGHT, GAME_RATIO)}px`;
// CHAT.style.width = `${CALCULATED_CHAT_WIDTH}px`;
// CHAT.style.height = `${CALCULATED_CHAT_HEIGHT}px`;
// console.log(CHAT.style.height + ' CHAT STYLE HEIGHT');

ws.onopen = (event) => {
  ws.onmessage = (msg) => handleMessageFromSever(msg.data);
  ws.onclose = (event) => {
    console.log('ws closed');
    alert('You are disconnected due to inactivity.');
    window.location.reload();
  };
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

const SCREEN_WIDTH_RATIO = USER_SCREEN_WIDTH / STANDARD_WIDTH;
const SCREEN_HEIGHT_RATIO = USER_SCREEN_HEIGHT / STANDARD_HEIGHT;

const INVERSE_SCREEN_WIDTH_RATIO = STANDARD_WIDTH / USER_SCREEN_WIDTH;
const INVERSE_SCREEN_HEIGHT_RATIO = STANDARD_HEIGHT / USER_SCREEN_HEIGHT;

// server to client height
function convertStandardHeightToClientHeight(measurement) {
  return measurement * SCREEN_HEIGHT_RATIO;
}

// server to client width
function convertStandardWidthToClientWidth(measurement) {
  return measurement * SCREEN_WIDTH_RATIO;
}

// client to server height
function convertClientHeightToStandardHeight(measurement) {
  return measurement * INVERSE_SCREEN_HEIGHT_RATIO;
}

// client to server width
function convertClientWidthToStandardWidth(measurement) {
  return measurement * INVERSE_SCREEN_WIDTH_RATIO;
}

function applyConversionToScreen(measurement) {
  return Math.floor(convertStandardWidthToClientWidth(measurement));
}
