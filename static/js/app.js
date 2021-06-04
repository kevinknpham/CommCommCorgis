// size of corgi
const characterLength = 120;
const characterConstant = 1.5; // left 2 top 3

function moveCharacter(username) {
  let userCharacter = document.getElementById(username);

  document.getElementById('myCanvas').onclick = (event) => {
    let currentLeftPosition =
      event.clientX - characterLength / characterConstant;
    let currentTopPosition =
      event.clientY - characterLength / characterConstant;

    // moveCharactertoPosition(
    //   userCharacter,
    //   currentLeftPosition,
    //   currentTopPosition
    // );

    sendMoveRequestToServer(
      username,
      convertClientWidthToStandardWidth(currentLeftPosition),
      convertClientHeightToStandardHeight(currentTopPosition)
    );
  };
}

function moveCharactertoPosition(character, x, y) {
  character.style.left = `${x}px`;
  character.style.top = `${y}px`;
}

function handleMoveChar(data) {
  console.log(data);
  if (data.name && data.x && data.y) {
    let userCharacter = document.getElementById(data.name);
    let characterLeftPosition = convertStandardWidthToClientWidth(data.x);
    let characterTopPosition = convertStandardHeightToClientHeight(data.y);
    moveCharactertoPosition(
      userCharacter,
      characterLeftPosition - adjustment,
      characterTopPosition
    );
  }
}

function sendMoveRequestToServer(username, x, y) {
  let datum = {
    name: username,
    x: parseInt(x),
    y: parseInt(y),
    action: 'update'
  };
  ws.send(JSON.stringify(datum));
  console.log(datum);
}
