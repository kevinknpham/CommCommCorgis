if (!sessionStorage.getItem("commcommcorgis_username")) {
  window.open("index.html", "_self");
}

let HOST = location.origin.replace(/^http/, 'ws');
let ws = new WebSocket(HOST);
ws.onopen = (event) => {
  ws.onmessage = (msg) => handleMessage(msg);
  setInputFunctionality();
};

function handleMessage(message) {
  console.log(message);
  data = JSON.parse(message.data);
  if (data.action && data.action == "chat") {
    document.querySelector(".post-container").appendChild(createPost(data));
  }
}

function setInputFunctionality() {
  const input = document.querySelector(".post-input input");
  const postBtn = document.getElementById("post-button");
  input.addEventListener("input", function (e) {
    postBtn.disabled = e.target.value.length === 0;
  });
  postBtn.addEventListener("click", function () {
    let datum = {
      text: input.value,
      user: "Miguel",
      action: "chat",
    };
    // document.querySelector(".post-container").appendChild(createPost(datum));
    ws.send(JSON.stringify(datum));
  });
}

function createPost(info) {
  let postContainer = document.createElement("div");

  postContainer.innerHTML =
    `<div class="post">` +
    `<div class="post-content">` +
    `<p class="bold">${info.user}</p>` +
    `<p>${info.text}</p>` +
    `</div>`;

  return postContainer;
}
