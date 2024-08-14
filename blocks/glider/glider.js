import Glider from "../../common/carousel/glider.min.js";
import { generateEmbed } from "../embed/embed.js";

export default function decorate(block) {
  const rows = Array.from(block.children);
  let config = {};
  let prev;
  let next;
  const gliderContainer = document.createElement("div");
  gliderContainer.dataset.gliderContainer = "glider-container";
  const dots = document.createElement("div");
  rows.forEach((row, index) => {
    if (rows.length === index + 1) {
      // Last row will be configurable
      const [configData, prevEl, nextEl] = row.children;
      config = JSON.parse(configData.innerText);
      prev = prevEl;
      next = nextEl;
      prev.classList.add("glider-prev");
      next.classList.add("glider-next");
    } else {
      row.dataset.rowIndex = `row-${index}`;
      const columnWrapper = document.createElement("div");
      columnWrapper.dataset.columnWrapper = "column-wrapper";
      Array.from(row.children).forEach((cloumn, index) => {
        cloumn.dataset.columnIndex = `column-${index}`;
        if (block.classList.contains("embed") && !index) {
          const link = cloumn.innerText.trim();
          cloumn.innerHTML = '';
          columnWrapper.append(generateEmbed(cloumn, link));
        } else {
          columnWrapper.append(cloumn);
        }
      });
      row.append(columnWrapper);
      gliderContainer.append(row);
    }
  });
  block.innerHTML = "";
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
