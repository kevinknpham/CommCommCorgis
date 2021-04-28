let HOST = location.origin.replace(/^http/, "ws");
let ws = new WebSocket(HOST);

ws.onopen = (event) => {
  ws.onmessage = (msg) => handleMessageFromSever(msg.data);
  ws.onclose = (event) => console.log("ws closed");
  setChat();
};

function handleMessageFromSever(msg) {
  console.log(msg);
  data = JSON.parse(msg);
  if (data.action) {
    const action = data.action.toLowerCase();

    switch (action) {
      case "chat": // chat messages
        addNewestChatMessage(data);
        break;
      case "new_char": // create new character
        addCharacterName(data);
        break;
      case "remove_char": // remove character from game
        removeCharacterName(data);
        break;
      case "move_char": // update character position
        updateCharacterPosition(data);
        break;
      case "list":
        updateCharacterList(data);
        break;
      default:
        console.log(action + " is not a valid action");
    }
  }
}
