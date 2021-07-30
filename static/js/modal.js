function showModal(titleHtml, contentHtml, runGame) {
  const modal = document.createElement('div');

  modal.classList.add('modal');
  modal.innerHTML = `
        <div class="modal__inner">
            <div class="modal__top">
                <div class="modal__title">${titleHtml}</div>
                <button class="modal__close" type="button">
                    <span class="material-icons">close</span>
                </button>
            </div>
            <div class="modal__content">${contentHtml}</div>
        </div>
    `;

  modal.querySelector('.modal__close').addEventListener('click', () => {
    document.body.removeChild(modal);
  });

  document.body.appendChild(modal);
  runGame();
}

showModal('chess', `<div id="myBoard" style="width: 400px"></div>`, playChess);

playing();
