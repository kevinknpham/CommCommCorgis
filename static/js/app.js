"use strict";

// - mouse is clicked (function started by onClick)

var currentPosition = document.querySelector(".character");
var cursorX;
var cursorY;

var charLength = 120;

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
