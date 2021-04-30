let username;
const CANVAS = document.getElementById("myCanvas");

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
    // sessionStorage.setItem("commcommcorgis_username", username);
    sendCharacterToServer(username);
    createCharacterAsset(username);
    moveCharacter(username);
    ws.send(JSON.stringify({ action: "list" }));
    switchScreen("white", "none", "block");
  }
}

// Create and append user's character to game background
function createCharacterAsset(username) {
  const newCharacter = document.createElement("div");
  newCharacter.classList.add("character");
  newCharacter.setAttribute("id", username);
  CANVAS.appendChild(newCharacter);

  const nameTag = document.createElement("p");
  nameTag.classList.add("name-tag");
  nameTag.innerText = username;

  const newCharacterImage = document.createElement("img");
  newCharacterImage.setAttribute("src", "assets/corgi-slide.png");
  newCharacterImage.classList.add("character-image");

  newCharacter.appendChild(nameTag);
  newCharacter.appendChild(newCharacterImage);
}

// Create other user's character and adds to user's game instance
// update that character to game server list
function addCharacterName(data) {
  if (data.name) {
    // sendCharacterToServer(data.name);
    ws.send(JSON.stringify({ action: "list" }));
  }
}

// Create given user's character and adds to game server list
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
  switchScreen("#d4dbf5", "block", "none");
  removeCharacterFromServer(username);
  CANVAS.removeChild(document.getElementById(username));
  // sessionStorage.removeItem("commcommcorgis_username");
  ws.send(JSON.stringify({ action: "list" }));
}

// Remove other user's character from user's game instance
// update that character to the server list
function removeCharacterName(data) {
  console.log("remove?");
  if (data.name) {
    console.log("removed???");
    //removeCharacterFromServer(data.name);
    ws.send(JSON.stringify({ action: "list" }));
  }
}

// remove given user's character from the user's game instance
function removeCharacterFromServer(username) {
  let datum = {
    name: username,
    action: "leave",
  };
  ws.send(JSON.stringify(datum));
}

// update character list to the server
function updateCharacterList(data) {
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
      addCharacterName(character.name);
      createCharacterAsset(character.name);
    } else if (username && document.getElementById(character.name)) {
      console.log("hello2");
      updateCharacterPosition(character);
    } else {
      removeCharacterName(character.name);
      CANVAS.removeChild(document.getElementById(character.name));
    }
  }
}

// swtich login page to main game page when the user logs in
// switch main game page to log out page when the user logs out
function switchScreen(color, loginPage, mainPage) {
  document.querySelector("body").style.backgroundColor = color;
  document.getElementById("login-page").style.display = loginPage;
  document.getElementById("main-page").style.display = mainPage;
}

login();
