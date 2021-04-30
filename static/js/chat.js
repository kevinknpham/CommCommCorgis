function addNewestChatMessage(data) {
  console.log(data);
  if (data.user && data.text) {
    document.querySelector(".post-container").appendChild(createPost(data));
    document.querySelector(".post-container").lastChild.scrollIntoView(false);
  }
}

function setChat() {
  let input = document.querySelector(".post-input input");
  const postBtn = document.getElementById("post-button");
  input.addEventListener("input", function (e) {
    postBtn.disabled = e.target.value.length === 0;
  });
  input.addEventListener("keyup", function (e) {
    if (e.key === "Enter") {
      sendChat();
    }
  });
  postBtn.addEventListener("click", sendChat);
}

function sendChat() {
  let input = document.querySelector(".post-input input");
  let datum = {
    text: input.value,
    user: username,
    action: "chat",
  };
  ws.send(JSON.stringify(datum));
  document.querySelector(".post-input input").value = "";
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
