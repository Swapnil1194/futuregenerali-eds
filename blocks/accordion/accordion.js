/*
 * Accordion Block
 * Recreate an accordion
 * https://www.hlx.live/developer/block-collection/accordion
 */

function isDesktop() {
  return window.innerWidth >= 1024;
}

export default function decorate(block) {
  [...block.children].forEach((row) => {
    // decorate accordion item label
    const label = row.children[0];
    const summary = document.createElement("summary");
    summary.className = "accordion-item-label";
    summary.append(...label.childNodes);
    // decorate accordion item body
    const body = row.children[1];
    body.className = "accordion-item-body";
    // decorate accordion item
    const details = document.createElement("details");
    details.className = "accordion-item";
    if (isDesktop()) {
      details.setAttribute("open", "");
      details.addEventListener("click", (e) =>{
        e.preventDefault();
      })
    } else {
      details.removeAttribute("open");
    }
    details.append(summary, body);
    row.replaceWith(details);
  });
}
