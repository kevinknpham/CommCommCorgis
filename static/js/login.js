const form = document.getElementById("form");
form.addEventListener("submit", login());

function login() {
  const input = document.getElementById("login-input");
  const loginBtn = document.getElementById("login-button");
  input.addEventListener("input", function (e) {
    loginBtn.disabled = e.target.value.length === 0;
  });
  const username = document.getElementById("login-input").value;
  // loginBtn.addEventListener("click", function () {
  //   const username = document.getElementById("login-input").value;
  //   window.location.href = "main.html";
  // });
}
