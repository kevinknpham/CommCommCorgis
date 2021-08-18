let username;

// Used for box shadow on character selection
const COLOR_TO_CLASS_NAME = Object.freeze(
  new Map([
    ['none', 'gray-box-shadow'],
    ['red', 'red-box-shadow'],
    ['green', 'green-box-shadow'],
    ['blue', 'blue-box-shadow']
  ])
);

window.addEventListener('beforeunload', function (e) {
  logout();
});

window.addEventListener('onclose', function (e) {
  logout();
});

// click or press enter allow user to join the game
function login() {
  const input = document.getElementById('login-input');
  const loginBtn = document.getElementById('login-button');
  input.addEventListener('input', function (e) {
    loginBtn.disabled = e.target.value.length === 0;
  });

  input.addEventListener('keyup', function (e) {
    if (e.key === 'Enter') {
      submitUserName(input.value);
    }
  });
  loginBtn.addEventListener('click', () => {
    submitUserName(input.value);
  });
}

function submitUserName(username) {
  const userNamePattern = /[A-Za-z0-9]+/;
  if (userNamePattern.test(username)) {
    toggleLoadingScreen(true, 'loginPage');
    sendUserDataToServer(username);
  } else {
    swal(`Username is not alpha-numberic`, {
      buttons: {
        ok: 'OK'
      }
    });
  }
}

function revealCharacterSelection() {
  switchScreen('characterPage', 'd4dbf5');
}

function setUpCharacterSelection() {
  let characterSelectionContainer = document.querySelector('.character-selection');
  for (let [color, image] of COLOR_TO_IMAGE_DEFAULT) {
    characterSelectionContainer.append(generateOption(image, color));
  }
}

function generateOption(url, color) {
  const image = document.createElement('img');
  image.src = url;
  image.alt = color;
  image.classList.add('character-selection-box');
  image.classList.add(COLOR_TO_CLASS_NAME.get(color));

  image.addEventListener('click', () => selectCharacter(color));
  return image;
}

function selectCharacter(color) {
  initiateUserCharacter();
  sendUserColorToServer(color);
  switchScreen('mainPage', 'white');
}

// Initialize user character and switch to the main game page from login page
// and send the user data to server
// only allow if user types something in login page
function initiateUserCharacter() {
  username = document.getElementById('login-input').value;
  if (username && username.length > 0) {
    ws.send(JSON.stringify({ action: 'list' }));
  }
}

// Sends the user's character color selection to the server
function sendUserColorToServer(color) {
  let datum = {
    name: username,
    attributes: { color: color },
    action: 'change_attribute'
  };
  ws.send(JSON.stringify(datum));
}

function handleModifyChar(data) {
  if (roomCheck(data.room)) {
    if (data.name && data.attributes) {
      characters.changeAttribute(data.name, data.attributes.color);
    }
  }
}

// Create other user's character and adds to user's game instance
// update that character to game server list
function handleNewChar(data) {
  if (roomCheck(data.room)) {
    if (data.name) {
      characters.addCharacter(data.name, data.x, data.y, data.attributes.color);
    }
  }
}

// Create given user's character and adds to game server list
function sendUserDataToServer(username) {
  let datum = {
    name: username,
    action: 'create'
  };
  ws.send(JSON.stringify(datum));
}

// click allow user to exit the game and go back to login page
// remove character asset from user's game instance
function logout() {
  toggleLoadingScreen(false, 'loginPage');
  switchScreen('loginPage', '#d4dbf5');
  sendLeaveRequestToServer(username);
}

// Remove other user's character from user's game instance
// update that character to the server list
function handleRemoveChar(data) {
  if (data.name) {
    characters.removeCharacter(data.name);
  }
}

// remove given user's character from the user's game instance
function sendLeaveRequestToServer(username) {
  let datum = {
    name: username,
    action: 'leave'
  };
  ws.send(JSON.stringify(datum));
}

// update character list to the server
function handleList(data) {
  if (data.list) {
    const newRoom = characters.getRoomName();
    createCharacterFromList(data.list.filter(element => element.room === newRoom));
  }
}

// if the given username from user's instance does not exist in server,
// then adds to both the server and the user's instance
// if not, then update that character position to the server
function createCharacterFromList(list) {
  for (let character of list) {
    if (username !== character.name && !characters.getCharacterInfo(character.name)) {
      handleNewChar(character);
      characters.changeAttribute(character.name, character.attributes.color);
      characters.moveCharacter(character.name, character.x, character.y);
    } else if (characters.getCharacterInfo(character.name)) {
      handleMoveChar(character);
    }
  }
}

function handleLoginResult(data) {
  if (data.status) {
    if (data.status === 'success') {
      revealCharacterSelection();
      setUpCanvasBackground(data.roomInfo);
      characters.setRoomName(data.roomInfo.name);
    } else if (data.status === 'failure') {
      toggleLoadingScreen(false, 'loginPage');
      swal(`${data.requested_name} is taken`, {
        buttons: {
          ok: 'OK'
        }
      });
    } else {
      console.log(data.status + ' invalid login result status');
    }
  }
}

function handleChangeRoomResult(data) {
  setUpCanvasBackground(data.roomInfo);
  toggleLoadingScreen(false, 'mainPage');
  characters.clearCharacters();
  characters.setRoomName(data.roomInfo.name);
  ws.send(JSON.stringify({ action: 'list' }));
}

function setUpCanvasBackground(data) {
  canvas.setUpCanvasInfo(data.backgroundUrl, data.width, data.height);
  characters.setDoors(data.doors);
  console.log('data + activites');
  console.log(data);
  console.log(data.activities);
  characters.setActivities(data.activities);
}

function sendChangeRoomRequestToServer(roomName) {
  let datum = {
    new_room: roomName,
    action: 'change_room'
  };
  ws.send(JSON.stringify(datum));
}

// swtich login page to main game page when the user logs in
// switch main game page to log out page when the user logs out
function switchScreen(page, backgroundColor) {
  document.querySelector('body').style.backgroundColor = backgroundColor;
  document.getElementById('login-page').style.display = 'none';
  document.getElementById('character-page').style.display = 'none';
  document.getElementById('main-page').style.display = 'none';

  switch (page) {
    case 'loginPage':
      document.getElementById('login-page').style.display = 'block';
      break;
    case 'characterPage':
      document.getElementById('character-page').style.display = 'block';
      break;
    case 'mainPage':
      document.getElementById('main-page').style.display = 'grid';
      break;
  }
}

function toggleLoadingScreen(showLoading, page) {
  document.getElementById('loading-screen').style.display = showLoading ? 'block' : 'none';
  switch (page) {
    case 'loginPage':
      document.getElementById('login-page').style.display = showLoading ? 'none' : 'block';
      break;
    case 'mainPage':
      document.getElementById('main-page').style.display = showLoading ? 'none' : 'block';
      break;
  }
}

function roomCheck(room) {
  return characters.getRoomName() === room;
}

login();
