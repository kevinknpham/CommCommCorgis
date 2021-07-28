//https://github.com/Nimzozo/Ab-Chess/tree/master
function playChess() {
  const gameContainer = document.createElement('div');
  gameContainer.setAttribute('id', 'chessboard');
  someName.appendChild(gameContainer);

  const abChess = {};
  const options = {
    width: 500
  };
  abChess = new AbChess('chessboard', options);
  abChess.setFEN();
}
