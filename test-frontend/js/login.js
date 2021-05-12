let username;
const CANVAS = document.getElementById("myCanvas");
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
    createCharacterAsset(username);
    moveCharacter();
    switchScreen("white", "none", "block", "none");
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

// swtich login page to main game page when the user logs in
// switch main game page to log out page when the user logs out
function switchScreen(color, loginPage, characterPage, mainPage) {
  document.querySelector("body").style.backgroundColor = color;
  document.getElementById("login-page").style.display = loginPage;
  document.getElementById("character-page").style.display = characterPage;
  document.getElementById("main-page").style.display = mainPage;
}

login();
