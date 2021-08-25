// change the dimension of game screen

// window.addEventListener('resize', function () {
//   console.log(window.innerWidth + ' is window innerwidth');
//   const canvasContainer = document.getElementById('myCanvas');
//   const chatContainer = document.getElementById('chat');
//   canvasContainer.style.width = window.innerWidth * 0.7;
//   canvasContainer.style.height = window.innerHeight;
//   chatContainer.style.width = window.innerWidth * 0.3;
//   chatContainer.style.height = window.innerHeight;
// });

// const STANDARD_WIDTH = 1920;
// const STANDARD_HEIGHT = 1080;

// const STANDARD_HEIGHT_TO_WIDTH = STANDARD_HEIGHT / STANDARD_WIDTH;
// const STANDARD_WIDTH_TO_HEIGHT = STANDARD_WIDTH / STANDARD_HEIGHT;

// const USER_SCREEN_WIDTH = window.innerWidth;
// const USER_SCREEN_HEIGHT = window.innerHeight;

// const USER_SCREEN_RATIO = USER_SCREEN_HEIGHT / USER_SCREEN_WIDTH;
// const USER_TO_STANDARD_RATIO = USER_SCREEN_HEIGHT / STANDARD_HEIGHT;
// const STANDARD_TO_USER_RATIO = STANDARD_HEIGHT / USER_SCREEN_HEIGHT;

// console.log(USER_SCREEN_HEIGHT + ' USER_SCREEN_HEIGHT');
// console.log(USER_SCREEN_WIDTH + ' USER_SCREEN_WIDTH');

// console.log(USER_TO_STANDARD_RATIO + ' USER_TO_STANDARD_RATIO');

// let temp_content_width;
// let temp_content_height;
// let adjustmentX = 0;
// let adjustmentY = 0;

// if (USER_SCREEN_RATIO === STANDARD_HEIGHT_TO_WIDTH) {
//   // e.g. 16:9 ratio
//   temp_content_height = STANDARD_HEIGHT * USER_TO_STANDARD_RATIO;
//   temp_content_width = STANDARD_WIDTH * USER_TO_STANDARD_RATIO;
// } else if (USER_SCREEN_RATIO > STANDARD_HEIGHT_TO_WIDTH) {
//   // e.g. 4:3 ratio
//   temp_content_height = USER_SCREEN_WIDTH * STANDARD_HEIGHT_TO_WIDTH;
//   temp_content_width = USER_SCREEN_WIDTH;
// } else {
//   // e.g. 21:9 ratio
//   temp_content_height = STANDARD_HEIGHT * USER_TO_STANDARD_RATIO;
//   temp_content_width = STANDARD_WIDTH * USER_TO_STANDARD_RATIO;
// }
// console.log(temp_content_width + ' temp_content_width');
// adjustmentX = (USER_SCREEN_WIDTH - temp_content_width) * 0.25;
// adjustmentY = USER_SCREEN_HEIGHT - temp_content_height;
// console.log(adjustmentX + ' adjustmentX');
// console.log(adjustmentY + ' adjustmentY');

// console.log(temp_content_width + ' CONTENT WIDTH');
// console.log(temp_content_height + ' CONTENT HEIGHT');

// const CONTENT = document.getElementById('content');
// CONTENT.style.width = `${temp_content_width}px`;
// CONTENT.style.height = `${temp_content_height}px`;

// const CANVAS = document.getElementById('myCanvas');
// const CHAT = document.getElementById('chat');

// let game_height = temp_content_height * 0.9;
// let chat_height = game_height;

// let game_width = (game_height * 740) / 468;
// let chat_width = temp_content_width - game_width - 10;

// console.log(game_width + ' GAME WIDTH');
// console.log(game_height + ' GAME HEIGHT');

// console.log(chat_width + ' CHAT WIDTH');
// console.log(chat_height + ' CHAT HEIGHT');

// CANVAS.style.width = `${game_width}px`;
// CANVAS.style.height = `${game_height}px`;

// CHAT.style.width = `${chat_width}px`;
// CHAT.style.height = `${chat_height}px`;

// const SCREEN_WIDTH_RATIO = USER_SCREEN_WIDTH / STANDARD_WIDTH;
// const SCREEN_HEIGHT_RATIO = USER_SCREEN_HEIGHT / STANDARD_HEIGHT;

// const INVERSE_SCREEN_WIDTH_RATIO = STANDARD_WIDTH / USER_SCREEN_WIDTH;
// const INVERSE_SCREEN_HEIGHT_RATIO = STANDARD_HEIGHT / USER_SCREEN_HEIGHT;

// // server to client height
// function convertStandardHeightToClientHeight(measurement) {
//   return measurement * SCREEN_HEIGHT_RATIO;
// }

// // server to client width
// function convertStandardWidthToClientWidth(measurement) {
//   return measurement * SCREEN_WIDTH_RATIO;
// }

// // client to server height
// function convertClientHeightToStandardHeight(measurement) {
//   return measurement * INVERSE_SCREEN_HEIGHT_RATIO;
// }

// // client to server width
// function convertClientWidthToStandardWidth(measurement) {
//   return measurement * INVERSE_SCREEN_WIDTH_RATIO;
// }

// function applyConversionToScreen(measurement) {
//   return Math.floor(convertStandardWidthToClientWidth(measurement));
// }

// const characterLength = applyConversionToScreen(120);
