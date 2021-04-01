const form = document.getElementById("form");
form.addEventListener("submit", login);
const input = document.getElementById("login-input");
const loginBtn = document.getElementById("login-button");
input.addEventListener("input", function (e) {
  loginBtn.disabled = e.target.value.length === 0;
});

function login() {
  const username = document.getElementById("login-input").value;
  if (username && username.length > 0) {
    let HOST = location.origin.replace(/^http/, 'ws');
    let ws = new WebSocket(HOST);
    ws.onopen = () => {
      ws.send(JSON.stringify({action: "create", name: username}));
    }
    ws.close();
    window.open(`main.html?name=${username}`);
  }
}
