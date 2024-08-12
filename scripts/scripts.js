import { loadFragment } from "../blocks/fragment/fragment.js";
import {
  buildBlock,
  loadHeader,
  loadFooter,
  decorateButtons,
  decorateIcons,
  decorateSections,
  decorateBlocks,
  decorateTemplateAndTheme,
  waitForFirstImage,
  loadSection,
  loadSections,
  loadCSS,
  sampleRUM,
} from "./aem.js";

/**
 * Builds hero block and prepends to main in a new section.
 * @param {Element} main The container element
 */
function buildHeroBlock(main) {
  const h1 = main.querySelector("h1");
  const picture = main.querySelector("picture");
  // eslint-disable-next-line no-bitwise
  if (
    h1 &&
    picture &&
    h1.compareDocumentPosition(picture) & Node.DOCUMENT_POSITION_PRECEDING
  ) {
    const section = document.createElement("div");
    section.append(buildBlock("hero", { elems: [picture, h1] }));
    main.prepend(section);
  }
}

/**
 * load fonts.css and set a session storage flag
 */
async function loadFonts() {
  await loadCSS(`${window.hlx.codeBasePath}/styles/fonts.css`);
  try {
    if (!window.location.hostname.includes("localhost")) {
      sessionStorage.setItem("fonts-loaded", "true");
    }
  } catch (e) {
    // do nothing
  }
}

function autolinkModals(element) {
  element.addEventListener("click", async (e) => {
    const origin = e.target.closest("a");

    if (origin && origin.href && origin.href.includes("/modals/")) {
      e.preventDefault();
      const { openModal } = await import(
        `${window.hlx.codeBasePath}/blocks/modal/modal.js`
      );
      openModal(origin.href);
    }
  });
}

function autolinkFragements(element) {
  element.querySelectorAll('a').forEach(async function (link) {
    if (link.href.includes('fragements')) {
      const path = link ? link.getAttribute('href') : link.textContent.trim();
      const fragment = await loadFragment(path);
      if (fragment) {
        const fragmentSection = fragment.querySelector(':scope .section');
        if (fragmentSection) {
          link.classList.add(...fragmentSection.classList);
          link.replaceWith(...fragment.childNodes);
        }
      }
    }
  })
}

/**
 * Builds all synthetic blocks in a container element.
 * @param {Element} main The container element
 */
function buildAutoBlocks(main) {
  try {
    buildHeroBlock(main);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Auto Blocking failed", error);
  }
}

/**
 * Decorates the main element.
 * @param {Element} main The main element
 */
// eslint-disable-next-line import/prefer-default-export
export function decorateMain(main) {
  // hopefully forward compatible button decoration
  decorateButtons(main);
  decorateIcons(main);
  // buildAutoBlocks(main);
  decorateSections(main);
  decorateBlocks(main);
}

/**
 * Loads everything needed to get to LCP.
 * @param {Element} doc The container element
 */
async function loadEager(doc) {
  document.documentElement.lang = "en";
  decorateTemplateAndTheme();
  const main = doc.querySelector("main");
  if (main) {
    decorateMain(main);
    document.body.classList.add("appear");
    await loadSection(main.querySelector(".section"), waitForFirstImage);
  }

  sampleRUM.enhance();

  try {
    /* if desktop (proxy for fast connection) or fonts already loaded, load fonts.css */
    if (window.innerWidth >= 900 || sessionStorage.getItem("fonts-loaded")) {
      loadFonts();
    }
  } catch (e) {
    // do nothing
  }
}

/**
 * Loads everything that doesn't need to be delayed.
 * @param {Element} doc The container element
 */
async function loadLazy(doc) {
  autolinkModals(doc);
  autolinkFragements(doc);
  const main = doc.querySelector("main");
  await loadSections(main);

  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();

  loadHeader(doc.querySelector("header"));
  loadFooter(doc.querySelector("footer"));

  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
  loadFonts();
}

/**
 * Loads everything that happens a lot later,
 * without impacting the user experience.
 */
function loadDelayed() {
  // eslint-disable-next-line import/no-cycle
  window.setTimeout(() => import("./delayed.js"), 3000);
  // load anything that can be postponed to the latest here
}

async function loadPage() {
  await loadEager(document);
  await loadLazy(document);
  loadDelayed();
}

loadPage();

export function renderHelper(data, template, callBack) {
  const dom = document.createElement("div");
  dom.innerHTML = template;
  const loopEl = dom.getElementsByClassName("forName");
  Array.prototype.slice.call(loopEl).forEach((eachLoop) => {
    let templates = "";
    const localtemplate = eachLoop.innerHTML;
    for (const key in data) {
      if (Object.hasOwnProperty.call(data, key)) {
        const element = data[key];
        // data.forEach(function (element, index) {
        var dataItem = callBack ? callBack(element, key) : element;
        const keys = Object.keys(dataItem);
        var copyTemplate = localtemplate;
        copyTemplate.split("{").forEach((ecahKey) => {
          const key = ecahKey.split("}")[0];
          const keys = key.split(".");
          let value = dataItem;
          keys.forEach((key) => {
            if (value && value[key]) {
              value = value[key];
            } else {
              value = "";
            }
          });
          copyTemplate = copyTemplate.replace(`{${key}}`, value);
        });
        templates += copyTemplate;
        // });
      }
    }
    eachLoop.outerHTML = templates;
  });
  return dom.innerHTML;
}

export function getProps(block, config) {
  return Array.from(block.children).map((el, index) => {
    if (config?.picture) {
      return el.innerHTML.includes("picture")
        ? el.querySelector("picture")
        : el.innerText.trim();
    }
    if (config?.index && config?.index.includes(index)) {
      return el;
    }
    return el.innerHTML.includes("picture")
      ? el.querySelector("img").src.trim()
      : el.innerText.trim();
  });
}

export async function fetchData(url) {
  try {
    let response = await fetch(url);
    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }
    let html = await response.text();

    return html;
  } catch (error) {
    console.error("Fetch error: ", error);
  }
}
/* fetchData("https://general.futuregenerali.in/content/experience-fragments/futuregeneraliindiainsurancecoltd/us/en/site/navigation-popup-content/product-xf.html") */