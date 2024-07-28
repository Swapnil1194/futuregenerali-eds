import { renderHelper, getProps } from "../../scripts/scripts.js";
import Glider from "../../common/carousel/glider.min.js";

export default function decorate(block) {
  const data = [];
  Array.from(block.children).forEach(function (child, index) {
    const childProps = getProps(child, {
      index: [0, 1, 2],
    });
    childProps[0] = getProps(childProps[0], {
      index: [0, 1, 2],
    });
    data.push(childProps);
  });
  console.log(data);
  block.innerHTML = `
    <div class="glider-contain">
        <div class="glider">
          ${renderHelper(
            data,
            ` <div class="forName">
                <div class="banner-wrapper">
                  <div class="banner">
                  <div class="fg-container">
                  <div class="banner__content">
                      <p class="banner__nudge">{0.0.innerText}</p>
                      <p class="banner__title">{0.1.innerText}</p>
                      <a href="{0.2.children.0.href}" class="banner__button mb-d">{0.2.innerText}</a>
                    </div>
                    <div class="banner__img mb-d">{1.outerHTML}</div>
                    <div class="banner__img-m de-d">{2.outerHTML}</div>
                    <a href="{0.2.children.0.href}" class="banner__button de-d">{0.2.innerText}</a>
                  </div>
                </div>
              </div>`
          )}
        </div>
       <div role="tablist" class="glider-dots"></div>
    </div>`;
  /* block.innerHTML = `<div class="glider-contain">
  <div class="glider">
    <div>your content here</div>
    <div>your content here</div>
    <div>your content here</div>
    <div>your content here</div>
  </div>

  <button aria-label="Previous" class="glider-prev">«</button>
  <button aria-label="Next" class="glider-next">»</button>
  <div role="tablist" class="dots"></div>
</div>`; */

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        new Glider(block.children[0].children[0], {
          slidesToShow: 1,
          dots: ".glider-dots",
          slidesToScroll: 1,
          draggable: true,
          arrows: {
            prev: ".glider-prev",
            next: ".glider-next",
          },
        });
      }
    });
  });
  observer.observe(block);
}
