/**
 * Implements the chat functionality in the website.
 * Sends and handles requests to server involved with the chat.
 * Also updates the UI to display the messages from each user in the chat box.
 */

/**
 * Modifies the UI to display the latest chat message
 *  in the data with the associated user
 * @param {*} data
 */
function handleChat(data) {
  if (roomCheck(data.room)) {
    console.log(data);
    if (data.user && data.text) {
      document.querySelector('.post-container').appendChild(createPost(data));
      document.querySelector('.post-container').lastChild.scrollIntoView(false);
    }
  }
}

/**
 * Sends the text typed by the user into the chat box
 *  when the user submits (by keyboard or button).
 * Takes in no parameters
 * Returns nothing
 */
function setChat() {
  let input = document.querySelector('.post-input input');
  const postBtn = document.getElementById('post-button');
  input.addEventListener('input', function (e) {
    postBtn.disabled = e.target.value.length === 0;
  });
  input.addEventListener('keyup', function (e) {
    if (e.key === 'Enter') {
      sendChatRequestToServer();
    }
  });
  postBtn.addEventListener('click', sendChatRequestToServer);
}

/**
 * Sends request to server to display chat message
 * Takes in no parameters
 * Returns nothing
 */
function sendChatRequestToServer() {
  let input = document.querySelector('.post-input input');
  let datum = {
    text: input.value,
    user: username,
    action: 'chat'
  };
  ws.send(JSON.stringify(datum));
  document.querySelector('.post-input input').value = '';
}

/**
 * Creates post in the chat with the text in the given info.
 * @param {*} info
 * @returns
 */
function createPost(info) {
  let postContainer = document.createElement('div');

  const urlRegex =
    /(https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*))/;
  info.text = info.text.replace(urlRegex, `<a href='$1' target='_blank'>$1</a>`);

  postContainer.innerHTML =
    `<div class="post">` +
    `<div class="post-content">` +
    `<p class="bold">${info.user}</p>` +
    `<p class="message">${info.text}</p>` +
    `</div>`;

  return postContainer;
}
