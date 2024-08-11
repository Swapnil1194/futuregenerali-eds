import { createOptimizedPicture } from "../../scripts/aem.js";

export default function decorate(block) {
  /* change to ul, li */
  const ul = document.createElement("ul");
  [...block.children].forEach((row) => {
    const li = document.createElement("li");
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector("picture"))
        div.className = "cards-card-image";
      else div.className = "cards-card-body";
    });
    ul.append(li);
  });
  ul.querySelectorAll("img").forEach((img) =>
    img
      .closest("picture")
      ?.replaceWith(
        createOptimizedPicture(img.src, img.alt, false, [{ width: "750" }])
      )
  );
  block.textContent = "";
  block.append(ul);

  /* Card Click */
  const sections = [
    "self",
    "couple",
    "smallfamily",
    "seniorcitizen",
    "jointfamily",
  ];
  const ulItems = Array.from(
    block.querySelectorAll(".health-priority-card li")
  );
  const btn = document.querySelector(
    ".health-priority-card .button-container a"
  );
  const buttonContainer = document.querySelector(
    ".health-priority-card .button-container"
  );

  ulItems.forEach((el, index) => {
    const section = sections[index % sections.length]; // Use modulus to handle cases where there are more lis than sections
    el.setAttribute("data-section", section);

    // Add onclick event to toggle 'active' class
    el.addEventListener("click", () => {
      // Remove 'active' class from all li elements
      ulItems.forEach((item) => item.classList.remove("active"));

      // Add 'active' class to the clicked li element
      el.classList.add("active");

      // Log the current data-section attribute
      console.log(el.getAttribute("data-section"));

      // Update the href attribute of the button
      btn.setAttribute(
        "href",
        "https://general.futuregenerali.in/need-analysis/select-gender"
      );

      // Remove opacity from button-container
      buttonContainer.style.opacity = "1";
      buttonContainer.style.pointerEvents = "auto"; // Ensure the button is clickable
      buttonContainer.style.cursor = "pointer";
    });
  });

  const getArrow = document.querySelector(".icon-uparrow");

  const scrollTop = document.createElement("div");
  scrollTop.className = "scroll-top";

  const scrollBtn = document.createElement("div");
  scrollBtn.className = "scroll-btn";

  scrollBtn.appendChild(getArrow);
  scrollTop.appendChild(scrollBtn);
  document.body.appendChild(scrollTop);

  // scrollTop.addEventListener("click", function () {
  //   window.scrollTo({
  //     top: 0,
  //     behavior: "smooth",
  //   });
  // });

  const listItems = block.querySelectorAll(".mob-bottom-navigation ul li");
  const targetValues = ["healthInsurance", "renew", "claim", "help"];
  listItems.forEach((li, index) => {
    li.classList.add("navigation-content");
    li.setAttribute("data-target", targetValues[index]);
  });

  const firstCarousel = document.querySelector(".glider");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        block.closest(".bottom-navigation-box")?.classList.remove("scrolled");
        scrollTop.style.opacity = "0";
      } else {
        block.closest(".bottom-navigation-box")?.classList.add("scrolled");
        scrollTop.style.opacity = "1";
      }
    });
  });
  observer.observe(firstCarousel, {
    threshold: 0.5,
  });
}
