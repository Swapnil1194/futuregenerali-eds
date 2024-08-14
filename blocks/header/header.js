import { getMetadata } from "../../scripts/aem.js";
import { fetchData } from "../../scripts/scripts.js";
import { loadFragment } from "../fragment/fragment.js";

// media query match that indicates mobile/tablet width
const isDesktop = window.matchMedia("(min-width: 900px)");
const overLay = document.createElement("div");
overLay.classList.add("overlay");

function closeOnEscape(e) {
  if (e.code === "Escape") {
    const nav = document.getElementById("nav");
    const navSections = nav.querySelector(".nav-sections");
    const navSectionExpanded = navSections.querySelector(
      '[aria-expanded="true"]'
    );
    if (navSectionExpanded && isDesktop.matches) {
      toggleAllNavSections(navSections);
      navSectionExpanded.focus();
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections);
      nav.querySelector("button").focus();
    }
  }
}

function closeOnFocusLost(e) {
  const nav = e.currentTarget;
  if (!nav.contains(e.relatedTarget)) {
    const navSections = nav.querySelector(".nav-sections");
    const navSectionExpanded = navSections.querySelector(
      '[aria-expanded="true"]'
    );
    if (navSectionExpanded && isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleAllNavSections(navSections, false);
    } else if (!isDesktop.matches) {
      // eslint-disable-next-line no-use-before-define
      toggleMenu(nav, navSections, false);
    }
  }
}

function openOnKeydown(e) {
  const focused = document.activeElement;
  const isNavDrop = focused.className === "nav-drop";
  if (isNavDrop && (e.code === "Enter" || e.code === "Space")) {
    const dropExpanded = focused.getAttribute("aria-expanded") === "true";
    // eslint-disable-next-line no-use-before-define
    toggleAllNavSections(focused.closest(".nav-sections"));
    focused.setAttribute("aria-expanded", dropExpanded ? "false" : "true");
  }
}

function focusNavSection() {
  document.activeElement.addEventListener("keydown", openOnKeydown);
}

/**
 * Toggles all nav sections
 * @param {Element} sections The container element
 * @param {Boolean} expanded Whether the element should be expanded or collapsed
 */
function toggleAllNavSections(sections, expanded = false) {
  sections
    .querySelectorAll(".nav-sections .default-content-wrapper > ul > li")
    .forEach((section) => {
      section.setAttribute("aria-expanded", expanded);
    });
}

/**
 * Toggles the entire nav
 * @param {Element} nav The container element
 * @param {Element} navSections The nav sections within the container element
 * @param {*} forceExpanded Optional param to force nav expand behavior when not null
 */
function toggleMenu(nav, navSections, forceExpanded = null) {
  const expanded =
    forceExpanded !== null
      ? !forceExpanded
      : nav.getAttribute("aria-expanded") === "true";
  const button = nav.querySelector(".nav-hamburger button");
  document.body.style.overflowY = expanded || isDesktop.matches ? "" : "hidden";
  nav.setAttribute("aria-expanded", expanded ? "false" : "true");
  toggleAllNavSections(
    navSections,
    expanded || isDesktop.matches ? "false" : "true"
  );
  button.setAttribute(
    "aria-label",
    expanded ? "Open navigation" : "Close navigation"
  );
  // enable nav dropdown keyboard accessibility
  const navDrops = navSections.querySelectorAll(".nav-drop");
  if (isDesktop.matches) {
    navDrops.forEach((drop) => {
      if (!drop.hasAttribute("tabindex")) {
        drop.setAttribute("tabindex", 0);
        drop.addEventListener("focus", focusNavSection);
      }
    });
  } else {
    navDrops.forEach((drop) => {
      drop.removeAttribute("tabindex");
      drop.removeEventListener("focus", focusNavSection);
    });
  }

  // enable menu collapse on escape keypress
  if (!expanded || isDesktop.matches) {
    // collapse menu on escape press
    window.addEventListener("keydown", closeOnEscape);
    // collapse menu on focus lost
    nav.addEventListener("focusout", closeOnFocusLost);
  } else {
    window.removeEventListener("keydown", closeOnEscape);
    nav.removeEventListener("focusout", closeOnFocusLost);
  }
}

/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // load nav as fragment
  const navMeta = getMetadata("nav");
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : "/nav";
  const fragment = await loadFragment(navPath);

  // decorate nav DOM
  block.textContent = "";
  const nav = document.createElement("nav");
  nav.id = "nav";
  while (fragment.firstElementChild) nav.append(fragment.firstElementChild);

  const classes = ["brand", "sections", "tools"];
  classes.forEach((c, i) => {
    const section = nav.children[i];
    if (section) section.classList.add(`nav-${c}`);
  });

  const navBrand = nav.querySelector(".nav-brand");
  const brandLink = navBrand.querySelector(".button");
  if (brandLink) {
    brandLink.className = "";
    brandLink.closest(".button-container").className = "";
  }

  const navSections = nav.querySelector(".nav-sections");
  if (navSections) {
    navSections
      .querySelectorAll(":scope .default-content-wrapper > ul > li")
      .forEach((navSection) => {
        if (navSection.querySelector("ul")) {
          navSection.classList.add("nav-drop");
        }
        navSection.addEventListener("click", () => {
          if (isDesktop.matches) {
            const expanded =
              navSection.getAttribute("aria-expanded") === "true";
            toggleAllNavSections(navSections);
            navSection.setAttribute(
              "aria-expanded",
              expanded ? "false" : "true"
            );
          }
        });
      });
  }

  // hamburger for mobile
  const hamburger = document.createElement("div");
  hamburger.classList.add("nav-hamburger");
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
      <span class="nav-hamburger-icon"></span>
    </button>`;
  // if(isDesktop){
  // hamburger.addEventListener('click', () => toggleMenu(nav, navSections));
  // }
  // hamburger.addEventListener("click", () => toggleMenu(nav, navSections));
  nav.prepend(hamburger);
  nav.setAttribute("aria-expanded", "false");
  // prevent mobile nav behavior on window resize
  toggleMenu(nav, navSections, isDesktop.matches);
  isDesktop.addEventListener("change", () =>
    toggleMenu(nav, navSections, isDesktop.matches)
  );

  const navWrapper = document.createElement("div");
  navWrapper.className = "nav-wrapper";
  navWrapper.append(nav);
  block.append(navWrapper);

  let isHeaderMenuPresent = false;

  const navHamburger = block.querySelector(".nav-hamburger");
  let popup = document.createElement("div");
  popup.classList.add("header-menu");
  Array.from(block.children)[0].children[0].append(popup);

  navHamburger.addEventListener("click", function (ele) {
    if (!isHeaderMenuPresent) {
      isHeaderMenuPresent = true;
    }

    this.parentElement.classList.toggle("expanded");
    this.closest(".header ")
      .querySelector(".header-menu")
      .classList.toggle("expanded");
    if (
      navHamburger
        .closest(".header ")
        .querySelector(".header-menu")
        .classList.contains("expanded")
    ) {
      document.querySelector(".mob-bottom-navigation").style.opacity = "0";
    } else {
      document.querySelector(".mob-bottom-navigation").style.opacity = "unset";
    }
    closeAllAccordions();
  });

  /* Custom Click */
  /*Mobile Nav Links  */
  const navLinkMob = block.querySelector(
    ".nav-tools >div >p:last-child a"
  ).href;

  let resp = await fetchData(navLinkMob);
  resp = resp.replaceAll(
    "/etc.clientlibs/",
    "https://general.futuregenerali.in/etc.clientlibs/"
  );

  const div = document.createElement("div");
  div.innerHTML = resp;
  const navContent = document.createElement("div");
  navContent.classList.add("mob-nav-wrapper", "jsMobileNavMenu", "dsp-none");
  const mbNavContainer = div.querySelector(".mob-nav-inner");
  navContent.append(mbNavContainer);
  popup.append(navContent);

  // Add all the stylesh1eets to the document head
  div.querySelectorAll("link").forEach((link) => {
    const newLink = document.createElement("link");
    newLink.href = link.href;
    newLink.rel = "stylesheet";
    document.head.append(newLink);
  });

  var mainLinks = document.querySelectorAll(".jsMobNavLinks");
  var nestedLinks = document.querySelectorAll(".jsNestedAccordLink");
  // Function to handle clicks on main navigation links
  mainLinks.forEach((link) => {
    link.addEventListener("click", function () {
      var nestedContent = this.nextElementSibling; // Assumes nested content directly follows the link
      var parentContainer = this.closest(".jsMobNavContents");
      if (!this.classList.contains("active")) {
        // Close all other main contents
        mainLinks.forEach((otherLink) => {
          otherLink.classList.remove("active");
          var otherContent = otherLink.nextElementSibling;
          var otherParentContainer = otherLink.closest(".jsMobNavContents");
          if (otherContent) {
            otherContent.classList.add("d-none");
          }
          if (otherParentContainer) {
            otherParentContainer.classList.remove("accord-open");
          }
        });

        // Open this link's content
        this.classList.add("active");
        if (nestedContent) {
          nestedContent.classList.remove("d-none");
        }
        if (parentContainer) {
          parentContainer.classList.add("accord-open");
        }
      } else {
        // Optional: toggle current item off
        this.classList.remove("active");
        if (nestedContent) {
          nestedContent.classList.add("d-none");
        }
        if (parentContainer) {
          parentContainer.classList.remove("accord-open");
        }
      }
    });
  });

  nestedLinks.forEach((link) => {
    link.addEventListener("click", function () {
      var detailsContent = this.nextElementSibling; // Assumes details content directly follows the link
      var parentNestedContent = this.closest(".nested-accord-content");
      if (!this.classList.contains("nested-accord-open")) {
        // Close all other nested contents within the same parent
        var parentNestedLinks = parentNestedContent.querySelectorAll(
          ".jsNestedAccordLink"
        );
        parentNestedLinks.forEach((otherLink) => {
          otherLink.classList.remove("nested-accord-open");
          var otherContent = otherLink.nextElementSibling;
          if (otherContent) {
            otherContent.classList.add("d-none");
          }
        });

        // Open this link's nested content
        this.classList.add("nested-accord-open");
        if (detailsContent) {
          detailsContent.classList.remove("d-none");
        }
      } else {
        // Optional: toggle current nested item off
        this.classList.remove("nested-accord-open");
        if (detailsContent) {
          detailsContent.classList.add("d-none");
        }
      }
    });
  });

  function closeAllAccordions() {
    var mainLinks = document.querySelectorAll(".jsMobNavLinks");
    var nestedLinks = document.querySelectorAll(".jsNestedAccordLink");

    // Close all main link accordions
    mainLinks.forEach((link) => {
      link.classList.remove("active");
      var nestedContent = link.nextElementSibling;
      var parentContainer = link.closest(".jsMobNavContents"); // Corrected to find the nearest parent container
      if (nestedContent) {
        nestedContent.classList.add("d-none");
      }
      if (parentContainer) {
        parentContainer.classList.remove("accord-open");
      }
    });

    // Close all nested link accordions
    nestedLinks.forEach((link) => {
      link.classList.remove("nested-accord-open");
      var detailsContent = link.nextElementSibling;
      if (detailsContent) {
        detailsContent.classList.add("d-none");
      }
    });
  }

  var navigationContents = document.querySelectorAll(".navigation-content");
  navigationContents.forEach(function (element) {
    element.addEventListener("click", function () {
      eventHandler();
      var targetName = this.getAttribute("data-target");
      var nestedAccordLinks = document.querySelectorAll(".nested-accord-link");
      nestedAccordLinks.forEach(function (nestedLink) {
        var nestedContentName = nestedLink.getAttribute("data-target");
        if (nestedContentName && nestedContentName.trim() === targetName) {
          var nestedContent = nestedLink.closest(".nested-accord-content");
          if (nestedContent) {
            nestedContent.classList.remove("d-none");
            nestedContent.previousElementSibling.classList.add("active");
            nestedLink.classList.add("nested-accord-open");
            var nestedContentDetails = nestedContent.querySelector(
              ".jsNestedContentDetails"
            );
            if (nestedContentDetails) {
              nestedContentDetails.classList.remove("d-none");
            }
          }
        }
      });
    });
  });

  function eventHandler() {
    if (!isHeaderMenuPresent) {
      isHeaderMenuPresent = true;
    }
    navHamburger.parentElement.classList.toggle("expanded");
    navHamburger
      .closest(".header ")
      .querySelector(".header-menu")
      .classList.toggle("expanded");
    document.querySelector(".mob-bottom-navigation").style.opacity = "0";
  }

  /*Mobile Nav Links Close */

  /*Desktop Nav Links  */
  let activeContent = null;

  const navLinksList = block
    .querySelector(".nav-sections")
    .querySelectorAll("a");
  navLinksList.forEach(async (link, ind) => {
    link.setAttribute("data-value", link.innerText.toLowerCase());

    const href = link.href;

    let resp = await fetchData(href);
    resp = resp.replaceAll(
      "/etc.clientlibs/",
      "https://general.futuregenerali.in/etc.clientlibs/"
    );

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = resp;
    const lozadImages = tempDiv.querySelectorAll("[data-src]");
    lozadImages.forEach((img) => {
      img.setAttribute("src", img.getAttribute("data-src"));
      img.removeAttribute("data-src");
    });
    resp = tempDiv.innerHTML;

    const div = document.createElement("div");
    div.innerHTML = resp;
    div.querySelectorAll("link").forEach((link) => {
      const newLink = document.createElement("link");
      newLink.href = link.href;
      newLink.rel = "stylesheet";
      document.head.append(newLink);
    });

    const navContent = document.createElement("div");
    navContent.classList.add("header-nav-content", "link-list");
    navContent.setAttribute("data-value", link.innerText.toLowerCase());
    const fgContainer = div.querySelector(".fg-container");
    navContent.append(fgContainer);
    nav.append(navContent);

    document.addEventListener("click", (e) => {
      // Hide the active content when clicking outside
      if (
        activeContent &&
        !e.target.closest(".nav-sections") &&
        !e.target.closest(".header-nav-content")
      ) {
        activeContent.classList.remove("active");
        activeContent = null;
        const listItems = block.querySelectorAll(".nav-sections li");
        document.body.style.overflow = "scroll";
        overLay.remove();
        listItems.forEach((li) => {
          // Check if aria-expanded is true, then set it to false
          if (li.getAttribute("aria-expanded") === "true") {
            li.setAttribute("aria-expanded", "false");
          }
        });
      }
    });

    link.addEventListener("click", (e) => {
      e.preventDefault();

      // Hide all content
      const navLinkContainer = block.querySelectorAll(".header-nav-content");
      const value = link.getAttribute("data-value");
      const relatedContent = document.querySelector(
        `.header-nav-content[data-value="${value}"]`
      );

      if (relatedContent) {
        if (activeContent === relatedContent) {
          // If the clicked link corresponds to the already active content, hide it
          relatedContent.classList.remove("active");
          document.body.style.overflow = "scroll";
          overLay.remove();
          activeContent = null;
        } else {
          // Otherwise, show the related content and hide others
          navLinkContainer.forEach((content) =>
            content.classList.remove("active")
          );
          document.body.style.overflow = "hidden";
          document.body.appendChild(overLay);
          relatedContent.classList.add("active");
          activeContent = relatedContent;
        }
      }
    });

    /*  */
    var parentTabs = document.querySelectorAll(
      ".custom-new-tabs > .custom-tabs-list > .tabs-item > .tab-btn"
    );
    var parentContents = document.querySelector(".custom-tab-content").children;
    parentTabs.forEach((tab) => {
      tab.addEventListener("click", function () {
        console.log("tab click");
        parentTabs.forEach((t) => t.classList.remove("active"));
        Array.from(parentContents).forEach((content) =>
          content.classList.add("d-none")
        );

        tab.classList.add("active");
        var tabId = tab.getAttribute("data-tab");
        var activeContent = Array.from(parentContents).find(
          (content) => content.getAttribute("data-content") === tabId
        );
        if (activeContent) {
          activeContent.classList.remove("d-none");
        }
      });
    });

    var nestedTabContainers = document.querySelectorAll(".horizontol-tabs");

    nestedTabContainers.forEach((container) => {
      var nestedTabs = container.querySelectorAll(".tab-btn");
      var nestedContents = container
        .closest(".tab-content-inner")
        .querySelector(".tab-content-right").children;

      nestedTabs.forEach((tab) => {
        tab.addEventListener("click", function () {
          nestedTabs.forEach((t) => t.classList.remove("active"));
          Array.from(nestedContents).forEach((content) =>
            content.classList.add("d-none")
          );

          tab.classList.add("active");
          var tabId = tab.getAttribute("data-nested-tab");
          var activeContent = Array.from(nestedContents).find(
            (content) => content.getAttribute("data-nested-content") === tabId
          );
          if (activeContent) {
            activeContent.classList.remove("d-none");
          }
        });
      });
    });
  });
}
