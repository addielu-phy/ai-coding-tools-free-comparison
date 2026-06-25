document.querySelectorAll('.reveal').forEach((button) => {
  button.addEventListener('click', () => {
    const answer = button.nextElementSibling;
    const show = !answer.classList.contains('show');
    answer.classList.toggle('show', show);
    button.textContent = show ? '收起答案' : '看答案';
    if (show) answer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });
});

const dialog = document.getElementById('imageDialog');
const modalImg = document.getElementById('modalImg');
const modalTitle = document.getElementById('modalTitle');

document.querySelectorAll('.shot-button').forEach((button) => {
  button.addEventListener('click', () => {
    modalImg.src = button.dataset.full;
    modalImg.alt = button.dataset.title || '放大檢視的錯題截圖';
    modalTitle.textContent = button.dataset.title || '原卷局部截圖';
    if (typeof dialog.showModal === 'function') {
      dialog.showModal();
    } else {
      window.open(button.dataset.full, '_blank', 'noopener');
    }
  });
});

document.getElementById('closeDialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => {
  const rect = dialog.getBoundingClientRect();
  const inDialog = rect.top <= event.clientY && event.clientY <= rect.bottom && rect.left <= event.clientX && event.clientX <= rect.right;
  if (!inDialog) dialog.close();
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && dialog.open) dialog.close();
});
