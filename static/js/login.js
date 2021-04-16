let username;
const CANVAS = document.getElementById("myCanvas");

function getLogin() {
  const input = document.getElementById("login-input");
  const loginBtn = document.getElementById("login-button");
  input.addEventListener("input", function (e) {
    loginBtn.disabled = e.target.value.length === 0;
  });
  input.addEventListener("keyup", function (e) {
    if (e.key === "Enter") {
      login();
    }
  });
  loginBtn.addEventListener("click", login);
}

function login() {
  username = document.getElementById("login-input").value;
  console.log(username);
  if (username && username.length > 0) {
    sessionStorage.setItem("commcommcorgis_username", username);
    createCharacter(username);
    sendChar(username);
    moveCharacter(username);

    document.querySelector("body").style.backgroundColor = "white";
    document.getElementById("login-page").style.display = "none";
    document.getElementById("main-page").style.display = "block";
  }
}

function createCharacter(username) {
  const newCharacter = document.createElement("img");
  newCharacter.setAttribute("src", "assets/corgi-slide.png");
  newCharacter.classList.add("character");
  newCharacter.setAttribute("id", username);
  CANVAS.appendChild(newCharacter);
}

function handleCreateChar(data) {
  if (data.name) {
    createCharacter(data.name);
  }
}

function sendChar(username) {
  let datum = {
    name: username,
    action: "create",
  };
  ws.send(JSON.stringify(datum));
}

function logout() {
  const canvas = document.getElementById("myCanvas");
  document.querySelector("body").style.backgroundColor = "pink";
  document.getElementById("login-page").style.display = "block";
  document.getElementById("main-page").style.display = "none";
  removeChar(username);
  CANVAS.removeChild(document.getElementById(username));
  sessionStorage.removeItem("commcommcorgis_username");
}

function handleLeave(data) {
  if (data.name) {
    removeChar(data.name);
  }
}

function removeChar(username) {
  let datum = {
    name: username,
    action: "leave",
  };
  ws.send(JSON.stringify(datum));
}

function handleList(data) {
  if (data.list) {
    createCharFromList(data.list);
  }
}

function createCharFromList(list) {
  for (let character of list) {
    if (username !== character && !document.getElementById(character.name)) {
      handleCreateChar(character.name);
    } else {
      handleUpdateChar(character);
    }
  }
}


getLogin();
