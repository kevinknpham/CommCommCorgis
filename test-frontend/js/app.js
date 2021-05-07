// size of corgi
const characterLength = 120;
const characterConstant = 1.5; // left 2 top 3
function moveCharacter() {
  let userCharacter = document.getElementById(username);


  document.getElementById("myCanvas").onclick = (event) => {
    let currentLeftPosition =
      event.clientX - characterLength / characterConstant;
    let currentTopPosition =
      event.clientY - characterLength / characterConstant;
    console.log(currentTopPosition);
    userCharacter.style.left = `${currentLeftPosition}px`;
    userCharacter.style.top = `${currentTopPosition}px`;
    console.log(userCharacter.style.top);
    console.log(userCharacter.id);
  };
    
}
