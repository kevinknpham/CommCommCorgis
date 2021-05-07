// size of corgi
const characterLength = 120;
const characterConstant = 1.5; // left 2 top 3

function moveCharacter(username) {
  let userCharacter = document.getElementById(username);


  document.getElementById("myCanvas").onclick = (event) => {
    let currentLeftPosition =
      event.clientX - characterLength / characterConstant;
    let currentTopPosition =
      event.clientY - characterLength / characterConstant;

    userCharacter.style.left = currentLeftPosition;
    userCharacter.style.right = currentTopPosition;
  };
    
}
