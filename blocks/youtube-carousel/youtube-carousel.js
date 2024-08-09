import Glider from '../../common/carousel/glider.min.js';
import { generateEmbed } from '../embed/embed.js';

export default function decorate(block) {
  const gliderContainer = document.createElement('div');
  gliderContainer.classList.add('glider-container');
  const rowsWrapper = document.createElement('div');
  rowsWrapper.classList.add('rows-wrapper');
  const rows = Array.from(block.children);
  let prev; let next; let
    config;
  rows.forEach((row, index) => {
    if (index === (rows.length - 1)) {
      // Last Row will be config
      row.remove();
      const configData = row.children[0];
      config = JSON.parse(configData.innerText.trim());
      const cloumn2 = row.children[1];
      [prev, next] = cloumn2.querySelectorAll('picture');
      prev.classList.add('glider-prev');
      next.classList.add('glider-next');
    } else {
      const columns = Array.from(row.children);
      row.classList.add(`row-${index}`);
      columns.forEach((cloumn, cloumnIndex) => {
        cloumn.classList.add(`cloumn-${cloumnIndex}`);
        const url = cloumn.querySelector('a')?.href;
        const picture = cloumn.querySelector('picture');
        if (url || picture) {
          cloumn.innerHTML = '';
          generateEmbed(cloumn, url, picture);
          picture?.addEventListener('click', () => {
            picture.remove();
          });
        }
        /*
        if (cloumnIndex === 0) {
          const url = cloumn.querySelector('a').href;
          const picture = cloumn.querySelector('picture');
          cloumn.innerHTML = '';
          generateEmbed(cloumn, url, picture);
          picture?.addEventListener('click', () => {
            picture.remove();
          });
        } */
      });
      rowsWrapper.append(row);
    }
  });
  gliderContainer.append(rowsWrapper);
  gliderContainer.append(prev);
  gliderContainer.append(next);
  block.append(gliderContainer);
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        return new Glider(rowsWrapper, config);
      }
    });
  });
  observer.observe(block);
}
