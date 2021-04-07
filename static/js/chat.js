function handleChat(data) {
  console.log(data);
  if (data.user && data.text) {
    document.querySelector(".post-container").appendChild(createPost(data));
  }
}

function setChat() {
  const input = document.querySelector(".post-input input");
  const postBtn = document.getElementById("post-button");
  input.addEventListener("input", function (e) {
    postBtn.disabled = e.target.value.length === 0;
  });
  postBtn.addEventListener("click", function () {
    let datum = {
      text: input.value,
      user: sessionStorage.getItem("commcommcorgis_username"),
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
