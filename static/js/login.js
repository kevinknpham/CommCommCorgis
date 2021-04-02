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

function login() {
  const username = document.getElementById("login-input").value;
  if (username && username.length > 0) {
    let HOST = location.origin.replace(/^http/, "ws");
    let ws = new WebSocket(HOST);
    ws.onopen = () => {
      ws.send(JSON.stringify({ action: "create", name: username }));
      ws.close();
    };
    sessionStorage.setItem("commcommcorgis_username", username);

    document.querySelector("body").style.backgroundColor = "white";
    document.getElementById("login-page").style.display = "none";
    document.getElementById("main-page").style.display = "block";
  }
}