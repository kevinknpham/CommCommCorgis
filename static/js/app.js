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

    // console.log(cursorX);
    // console.log(cursorY);

    currentPosition.style.left = `${cursorX - charLength / 1.5}px`;
    currentPosition.style.top = `${cursorY - charLength / 1.5}px`;
  };

  // - function that detects mouse pointer returns x,y value

  // - function that does animation of character (div?) to that value

  // - done!
}

function handleUpdateChar(data) {
  if (data.name && data.x && data.y) {
    var currentPosition = document.getElementById(data.name);
    currentPosition.style.left = `${data.x - charLength / 1.5}px`;
    currentPosition.style.top = `${data.y - charLength / 1.5}px`;
  }
}
