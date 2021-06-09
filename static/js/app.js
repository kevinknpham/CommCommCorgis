// size of corgi
// const characterConstant = 1.5; // left 2 top 3

function moveCharacter(username) {
  let userCharacter = document.getElementById(username);
  console.log(characterLength);
  document.getElementById('myCanvas').onclick = (event) => {
    let currentLeftPosition = event.clientX - characterLength / 2;
    let currentTopPosition = event.clientY - characterLength / 2;

    if (USER_SCREEN_RATIO === STANDARD_HEIGHT_TO_WIDTH) {
      // e.g. 16:9 ratio
      currentLeftPosition =
        convertClientWidthToStandardWidth(currentLeftPosition);
      currentTopPosition =
        convertClientHeightToStandardHeight(currentTopPosition);
    } else if (USER_SCREEN_RATIO > STANDARD_HEIGHT_TO_WIDTH) {
      // e.g. 4:3 ratio
      currentLeftPosition =
        convertClientWidthToStandardWidth(currentLeftPosition);
      currentTopPosition =
        convertClientWidthToStandardWidth(currentTopPosition);
    } else {
      // e.g. 21:9 ratio
      currentLeftPosition = convertClientWidthToStandardWidth(
        currentLeftPosition - adjustmentX
      );
      currentTopPosition =
        convertClientHeightToStandardHeight(currentTopPosition);
    }
    // moveCharactertoPosition(
    //   userCharacter,
    //   currentLeftPosition,
    //   currentTopPosition
    // );

    sendMoveRequestToServer(username, currentLeftPosition, currentTopPosition);
    console.log('X: ' + event.clientX + ' Y: ' + event.clientY);
  };
}

function moveCharactertoPosition(character, x, y) {
  character.style.left = `${x}px`;
  character.style.top = `${y}px`;
}

function handleMoveChar(data) {
  if (data.name && data.x && data.y) {
    let userCharacter = document.getElementById(data.name);
    let characterLeftPosition;
    let characterTopPosition;

    if (USER_SCREEN_RATIO === STANDARD_HEIGHT_TO_WIDTH) {
      // e.g. 16:9 ratio
      characterLeftPosition = convertStandardWidthToClientWidth(data.x);
      characterTopPosition = convertStandardHeightToClientHeight(data.y);
    } else if (USER_SCREEN_RATIO > STANDARD_HEIGHT_TO_WIDTH) {
      // e.g. 4:3 ratio
      characterLeftPosition = convertStandardWidthToClientWidth(data.x);
      characterTopPosition = convertStandardWidthToClientWidth(data.y);
    } else {
      // e.g. 21:9 ratio
      characterLeftPosition =
        convertStandardWidthToClientWidth(data.x) - adjustmentX;
      characterTopPosition = convertStandardHeightToClientHeight(data.y);
    }
    moveCharactertoPosition(
      userCharacter,
      characterLeftPosition,
      characterTopPosition
    );
  }
  console.log(adjustmentX + ' is adjustmentX value');
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
