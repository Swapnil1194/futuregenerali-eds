import Glider from '../../common/carousel/glider.min.js';
import { embedYoutube, loadEmbed } from '../embed/embed.js';

export default function decorate(block) {
  const carouselitem = Array.from(block.children);
  let config = {};
  let prev;
  let next;
  const gliderContainer = document.createElement('div');
  gliderContainer.dataset.gliderContainer = 'glider-container';
  const dots = document.createElement('div');
  carouselitem.forEach((item, index) => {
    if (carouselitem.length === index + 1) {
      const [configData, prevEl, nextEl] = item.children;
      config = JSON.parse(configData.innerText);
      prev = prevEl;
      next = nextEl;
      prev.classList.add('glider-prev');
      next.classList.add('glider-next');
    } else {
      item.dataset.rowIndex = `row-${index}`;
      const childwrap = document.createElement('div');
      childwrap.dataset.columnWrapper = 'column-wrapper';
      Array.from(item.children).forEach((el, index) => {
        el.dataset.columnIndex = `column-${index}`;
        if (block.classList.contains('embed')) {
          const link = el.innerText.trim();
          // const url = new URL(link);

          //         const div = document.createElement('div');
          //         div.innerHTML = embedYoutube(url);;
          //         childwrap.append(div);
          childwrap.append(loadEmbed(el, link));
        } else {
          childwrap.append(el);
        }
      });
      item.append(childwrap);
      gliderContainer.append(item);
    }
  });
  block.innerHTML = '';
  block.appendChild(gliderContainer);
  block.append(dots);
  block.append(prev);
  block.append(next);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        config.dots = config.dots && dots;
        config.arrows = {};
        config.arrows.prev = config.prev && prev;
        config.arrows.next = config.next && next;
        new Glider(block.children[0], config);
      }
    });
  });
  observer.observe(block);
}
