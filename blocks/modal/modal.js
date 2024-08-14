import { loadFragment } from "../fragment/fragment.js";
import {
  buildBlock,
  decorateBlock,
  loadBlock,
  loadCSS,
} from "../../scripts/aem.js";

/*
  This is not a traditional block, so there is no decorate function.
  Instead, links to a /modals/ path are automatically transformed into a modal.
  Other blocks can also use the createModal() and openModal() functions.
*/

export async function createModal(contentNodes) {
  await loadCSS(`${window.hlx.codeBasePath}/blocks/modal/modal.css`);
  const dialog = document.createElement("dialog");
  dialog.classList.add("dialog");
  const dialogContent = document.createElement("div");
  dialogContent.classList.add("modal-content");
  dialogContent.append(...contentNodes);
  dialog.append(dialogContent);

  const closeButton = document.createElement("button");
  closeButton.classList.add("close-button");
  closeButton.setAttribute("aria-label", "Close");
  closeButton.type = "button";
  closeButton.innerHTML = '<span class="icon icon-close"></span>';
  closeButton.addEventListener("click", () => dialog.close());
  dialog.prepend(closeButton);

  const block = buildBlock("modal", "");
  document.querySelector("main").append(block);
  decorateBlock(block);
  await loadBlock(block);

  const arrow = document.querySelector(".nav-tools >div >p:nth-of-type(2)");
  const overLay = document.createElement("div");
  overLay.classList.add("overlay");
  
  // close on click outside the dialog
  dialog.addEventListener("click", (e) => {
    const { left, right, top, bottom } = dialog.getBoundingClientRect();
    const { clientX, clientY } = e;
    if (
      clientX < left ||
      clientX > right ||
      clientY < top ||
      clientY > bottom
    ) {
      if (sectionElement) {
        arrow.classList.toggle("active");
      }
      document.body.style.overflow = "scroll";
      overLay.remove();
      dialog.close();
    }
  });

  dialog.addEventListener("close", () => {
    document.body.classList.remove("modal-open");
    block.remove();
  });

  block.innerHTML = "";
  block.append(dialog);

  let sectionElement = block.querySelector("div .modal-content .section").classList.contains("login-modal");


  return {
    block,
    showModal: () => {
      dialog.showModal();
      if (sectionElement) {
        arrow.classList.toggle("active");
      }
      document.body.style.overflow = "hidden";
      document.body.appendChild(overLay);
      // reset scroll position
      // setTimeout(() => {
      dialogContent.scrollTop = 0;
      // }, 0);
      dialog.querySelector(".section")?.classList.forEach(function (eachClass) {
        block.classList.add(eachClass);
      });
      document.body.classList.add("modal-open");
    },
  };
}

export async function openModal(fragmentUrl) {
  const path = fragmentUrl.startsWith("http")
    ? new URL(fragmentUrl, window.location).pathname
    : fragmentUrl;

  const fragment = await loadFragment(path);
  decorateBlock(fragment);
  const { showModal } = await createModal(fragment.childNodes);
  showModal();
}
