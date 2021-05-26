let username;
const CANVAS = document.getElementById("myCanvas");

const STANDARD_WIDTH = 1920;
const STANDARD_HEIGHT = 1080;

let clientWidth = pseudoMediaQueryWidth(screen.width);
let clientHeight = pseudoMediaQueryHeight(screen.height);


//
// function pseudoMediaQueryWidth(width) {
//   if (width < 1280) {
//     return 
//   } else if (width < ...) {

//   } else if (width < 1920) {

//   } else if (width <) {

//   }
// }


let screenRatio = screen.width / STANDARD_WIDTH;
let inverseScreenRatio = STANDARD_WIDTH / screen.width;

function convertStandardSizeToClientSize(measurement) {
  return measurement * screenRatio;
}

function convertClientSizeToStandardSize(measurement) {
  return measurement * inverseScreenRatio;
}

function 

const COLOR_TO_URL = Object.freeze(
  new Map([
    ["none", "assets/corgi-slide-none.png"],
    ["red", "assets/corgi-slide-red.png"],
    ["green", "assets/corgi-slide-green.png"],
    ["blue", "assets/corgi-slide-blue.png"],
  ])
);

// Used for box shadow on character selection
const COLOR_TO_CLASS_NAME = Object.freeze(
  new Map([
    ["none", "gray-box-shadow"],
    ["red", "red-box-shadow"],
    ["green", "green-box-shadow"],
    ["blue", "blue-box-shadow"],
  ])
);

window.addEventListener("beforeunload", function (e) {
  logout();
});

window.addEventListener("onclose", function (e) {
  logout();
});

// click or press enter allow user to join the game
function login() {
  const input = document.getElementById("login-input");
  const loginBtn = document.getElementById("login-button");
  input.addEventListener("input", function (e) {
    loginBtn.disabled = e.target.value.length === 0;
  });

  input.addEventListener("keyup", function (e) {
    if (e.key === "Enter") {
      toggleLoadingScreen(true);
      sendUserDataToServer(input.value);
      // revealCharacterSelection();
    }
  });
  loginBtn.addEventListener("click", () => {
    toggleLoadingScreen(true);
    sendUserDataToServer(input.value);
  });
}

function revealCharacterSelection() {
  switchScreen("characterPage", "d4dbf5");
}

function setUpCharacterSelection() {
  // let pictureDOMs = Array.from(COLOR_TO_URL.keys()).map(generateOption);
  let characterSelectionContainer = document.querySelector(
    ".character-selection"
  );
  for (let [color, url] of COLOR_TO_URL) {
    characterSelectionContainer.append(generateOption(url, color));
  }
  // pictureDOMs.forEach((picture) => characterSelectionContainer.append(picture));
  // let options = document.querySelectorAll(".character-selection-box");
  // options.forEach(option => option.addEventListener("click", selectCharacter(option)))
}

function generateOption(url, color) {
  const picture = document.createElement("picture");
  const sourceImage = document.createElement("source");
  const imgTag = document.createElement("img");

  picture.appendChild(sourceImage);
  picture.appendChild(imgTag);
  picture.classList.add("character-selection-box");

  sourceImage.srcset = url;

  imgTag.src = url;
  imgTag.alt = color;
  imgTag.classList.add("character-selection-box-img");

  imgTag.classList.add(COLOR_TO_CLASS_NAME.get(color));

  picture.addEventListener("click", () => selectCharacter(color));
  return picture;
}

function selectCharacter(color) {
  initiateUserCharacter();
  sendUserColorToServer(color);
  switchScreen("mainPage", "white");
}

// Initialize user character and switch to the main game page from login page
// and send the user data to server
// only allow if user types something in login page
function initiateUserCharacter() {
  username = document.getElementById("login-input").value;
  console.log(username);
  if (username && username.length > 0) {
    // sessionStorage.setItem("commcommcorgis_username", username);
    // sendUserDataToServer(username);
    //createCharacterAsset(username);
    moveCharacter(username);
    ws.send(JSON.stringify({ action: "list" }));
  }
}

// Create and append user's character to game background
function createCharacterAsset(username, color, x, y) {
  const newCharacter = document.createElement("div");
  newCharacter.classList.add("character");
  newCharacter.setAttribute("id", username);
  CANVAS.appendChild(newCharacter);

  const nameTag = document.createElement("p");
  nameTag.classList.add("name-tag");
  nameTag.innerText = username;

  const newCharacterImage = document.createElement("img");
  if (color) {
    newCharacterImage.setAttribute("src", COLOR_TO_URL.get(color));
  } else {
    newCharacterImage.setAttribute("src", COLOR_TO_URL.get("none"));
  }
  newCharacterImage.classList.add("character-image");

  newCharacter.appendChild(nameTag);
  newCharacter.appendChild(newCharacterImage);

  newCharacter.style.left = `${x}px`;
  newCharacter.style.top = `${y}px`;
}

function modifyCharacterAsset(username, url) {
  document.querySelector(`#${username} img`).setAttribute("src", url);
}

// Sends the user's character color selection to the server
function sendUserColorToServer(color) {
  let datum = {
    name: username,
    attributes: { color: color },
    action: "change_attribute",
  };
  ws.send(JSON.stringify(datum));
}

function handleModifyChar(data) {
  if (data.name && data.attributes) {
    console.log(data.attributes);
    const characterURL = COLOR_TO_URL.get(data.attributes.color);
    console.log(characterURL);
    modifyCharacterAsset(data.name, characterURL);
  }
}

// Create other user's character and adds to user's game instance
// update that character to game server list
function handleNewChar(data) {
  if (data.name) {
    createCharacterAsset(data.name, data.attributes.color, data.x, data.y);
  }
}

// Create given user's character and adds to game server list
function sendUserDataToServer(username) {
  let datum = {
    name: username,
    action: "create",
  };
  ws.send(JSON.stringify(datum));
}

// click allow user to exit the game and go back to login page
// remove character asset from user's game instance
function logout() {
  toggleLoadingScreen(false);
  switchScreen("loginPage", "#d4dbf5");
  sendLeaveRequestToServer(username);
  //CANVAS.removeChild(document.getElementById(username)); //??
  // sessionStorage.removeItem("commcommcorgis_username");
}

// Remove other user's character from user's game instance
// update that character to the server list
function handleRemoveChar(data) {
  if (data.name) {
    CANVAS.removeChild(document.getElementById(data.name));
  }
}

// remove given user's character from the user's game instance
function sendLeaveRequestToServer(username) {
  let datum = {
    name: username,
    action: "leave",
  };
  ws.send(JSON.stringify(datum));
}

// update character list to the server
function handleList(data) {
  if (data.list) {
    createCharacterFromList(data.list);
  }
}

// if the given username from user's instance does not exist in server,
// then adds to both the server and the user's instance
// if not, then update that character position to the server
function createCharacterFromList(list) {
  for (let character of list) {
    if (
      username !== character.name &&
      !document.getElementById(character.name)
    ) {
      console.log("hello1");
      handleNewChar(character);
      //createCharacterAsset(character.name);
    } else if (document.getElementById(character.name)) {
      console.log("hello2");
      handleMoveChar(character);
    }
  }
}

// swtich login page to main game page when the user logs in
// switch main game page to log out page when the user logs out
function switchScreen(page, backgroundColor) {
  document.querySelector("body").style.backgroundColor = backgroundColor;
  document.getElementById("login-page").style.display = "none";
  document.getElementById("character-page").style.display = "none";
  document.getElementById("main-page").style.display = "none";

  switch (page) {
    case "loginPage":
      document.getElementById("login-page").style.display = "block";
      break;
    case "characterPage":
      document.getElementById("character-page").style.display = "grid";
      break;
    case "mainPage":
      document.getElementById("main-page").style.display = "block";
      break;
  }
}

function handleLoginResult(data) {
  if (data.status) {
    if (data.status === "success") {
      revealCharacterSelection();
    } else if (data.status === "failure") {
      toggleLoadingScreen(false);
      alert(`${data.requested_name} is taken`);
    } else {
      console.log(data.status + " invalid login result status");
    }
  }
}

function toggleLoadingScreen(showLoading) {
  document.getElementById("loading-screen").style.display = showLoading
    ? "block"
    : "none";

  document.querySelector(".login-screen").style.display = showLoading
    ? "none"
    : "block";
}


login();
