let HOST = location.origin.replace(/^http/, "ws");
let ws = new WebSocket(HOST);

ws.onopen = (event) => {
  ws.onmessage = (msg) => handleMessage(msg.data);
  ws.onclose = (event) => console.log("ws closed");
  setChat();
};

function handleMessage(msg) {
  console.log(msg);
  data = JSON.parse(msg);
  if (data.action) {
    const action = data.action.toLowerCase();

    switch (action) {
      case "chat": // chat messages
        handleChat(data);
        break;
      case "new_char": // create new character
        handleCreateChar(data);
        break;
      case "remove_char": // remove character from game
        handleLeave(data);
        break;
      case "move_char": // update character position
        handleUpdateChar(data);
        break;
      default:
        console.log(action + " is not a valid action");
    }
  }
}
