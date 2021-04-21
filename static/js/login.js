let username;
const CANVAS = document.getElementById("myCanvas");

window.addEventListener("unload", function (e) {
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
      initiateUserCharacter();
    }
  });
  loginBtn.addEventListener("click", initiateUserCharacter);
}

// Initialize user character and switch to the main game page from login page
// and send the user data to server
// only allow if user types something in login page
function initiateUserCharacter() {
  username = document.getElementById("login-input").value;
  console.log(username);
  if (username && username.length > 0) {
    sessionStorage.setItem("commcommcorgis_username", username);
    sendCharacterToServer(username);
    createCharacterAsset(username);
    moveCharacter(username);
    ws.send(JSON.stringify({ action: "list" }));
    switchScreen("white", "none", "block");
  }
}

// Create and append user's character to game background
function createCharacterAsset(username) {
  const newCharacter = document.createElement("img");
  newCharacter.setAttribute("src", "assets/corgi-slide.png");
  newCharacter.classList.add("character");
  newCharacter.setAttribute("id", username);
  CANVAS.appendChild(newCharacter);
}

// Create other user's character and adds to user's game instance
function handleCreateChar(data) {
  if (data.name) {
    sendCharacterToServer(data.name);
    ws.send(JSON.stringify({ action: "list" }));
  }
}

// Create user's character and adds to game server list
function sendCharacterToServer(username) {
  let datum = {
    name: username,
    action: "create",
  };
  ws.send(JSON.stringify(datum));
}

// click allow user to exit the game and go back to login page
// remove character asset from user's game instance
function logout() {
  switchScreen("pink", "block", "none");
  removeCharacterFromServer(username);
  CANVAS.removeChild(document.getElementById(username));
  sessionStorage.removeItem("commcommcorgis_username");
  ws.send(JSON.stringify({ action: "list" }));
}

// Remove other user's character from user's game instance
function handleLeave(data) {
  if (data.name) {
    removeCharacterFromServer(data.name);
    ws.send(JSON.stringify({ action: "list" }));
  }
}

//
function removeCharacterFromServer(username) {
  let datum = {
    name: username,
    action: "leave",
  };
  ws.send(JSON.stringify(datum));
}

function handleList(data) {
  if (data.list) {
    createCharacterFromList(data.list);
  }
}

function createCharacterFromList(list) {
  for (let character of list) {
    if (
      username !== character.name &&
      !document.getElementById(character.name)
    ) {
      console.log("hello1");
      handleCreateChar(character.name);
      createCharacterAsset(character.name);
    } else {
      console.log("hello2");
      handleUpdateChar(character);
    }
  }
}

function switchScreen(color, loginPage, mainPage) {
  document.querySelector("body").style.backgroundColor = color;
  document.getElementById("login-page").style.display = loginPage;
  document.getElementById("main-page").style.display = mainPage;
}

login();
