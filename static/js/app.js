"use strict";

// - mouse is clicked (function started by onClick)
var charLength = 120;

function moveCharacter(username) {
  var currentPosition = document.getElementById(username);
  var cursorX;
  var cursorY;

  document.getElementById("myCanvas").onclick = (event) => {
    cursorX = event.clientX;
    cursorY = event.clientY;

    currentPosition.style.left = `${cursorX - charLength / 1.5}px`;
    currentPosition.style.top = `${cursorY - charLength / 1.5}px`;

    sentUpdateChar(
      username,
      currentPosition.style.left,
      currentPosition.style.top
    );
  };
}

function handleUpdateChar(data) {
  console.log(data);
  if (data.name && data.x && data.y) {
    var currentPosition = document.getElementById(data.name);
    currentPosition.style.left = `${data.x - charLength / 1.5}px`;
    currentPosition.style.top = `${data.y - charLength / 1.5}px`;
  }
}

function sentUpdateChar(username, x, y) {
  //let input = document.querySelector(".character");
  let datum = {
    name: username,
    x: parseInt(x),
    y: parseInt(y),
    action: "update",
  };
  ws.send(JSON.stringify(datum));
  console.log(datum);
}
