import { renderHelper, getProps } from "../../scripts/scripts.js";
import Glider from "../common/carousel/glider.min.js";
import Swiper from "./swiper/swipe.js";

var swiperInstance;

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
    <div class="hmpg-swiper-container hmpgBannerSlider swipper-main">
        <div class="swiper-wrapper">
            ${renderHelper(
              data,
              `<div class="forName">
                <div class="swiper-slide hmpg-slide-wrap" >
                    <div class="container fg-container">
                    <div class="hmpg-slide-wrap__content">
                        <div class="hmpg-slide-wrap__title">
                        <p>
                            <span class="hmpg-slide-wrap__nudge">
                                {0.0.innerHTML}
                            </span>
                        </p>
                        <p>{0.1.innerText} </p>
                        </div>
                        <div class="hmpg-slide-wrap__image mb-d "> 
                         {1.outerHTML} 
                         <a href="{0.2.children.0.href}"class="hmpg-slide-wrap__button hmpg-slide-wrap__button--mob">
                            {0.2.innerText}
                         </a>
                        </div>
                        <div class="hmpg-slide-wrap__image de-d ">  
                         {2.outerHTML}
                        </div>
                        <a href="{0.2.children.0.href}" class="hmpg-slide-wrap__button hmpg-slide-wrap__button--desk de-d ">
                        {0.2.innerText}
                        </a>
                    </div>
                    </div>
                </div>
            </div>`
            )}
        <div class="swiper-pagination"></div>
    </div>
    `;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // debugger;
        new Glider(block.children[0].children[0], {
          slidesToShow: 1,
          slidesToScroll: 1,
          scrollLock: true,
          dots: buttonContainer,
          arrows: {
            prev: slidePrev,
            next: slideNext,
          },
          scrollLock: true,
          draggable: true,
          responsive: [
            {
              breakpoint: 767,
              settings: {
                slidesToShow: 2,
                slidesToScroll: 1,
              },
            },
            {
              // screens greater than >= 1024px
              breakpoint: 1024,
              settings: {
                slidesToShow: 3.5,
                slidesToScroll: 1,
                arrows: {
                  prev: slidePrev,
                  next: slideNext,
                },
                scrollLock: true,
                draggable: true,
                settings: {
                  slidesToShow: 2,
                  slidesToScroll: 1,
                  duration: 0.25,
                },
              },
            },
          ],
        });
        // swiperInstance = new Swiper(block.children[0], {
        //   loop: true,
        //   slidesPerView: 1,
        //   grabCursor: true,
        //   autoplay: {
        //     delay: 5000,
        //     disableOnInteraction: false,
        //   },
        //   // pagination: {
        //   //   el: ".swiper-pagination",
        //   //   clickable: true,
        //   // },

        //   breakpoints: {
        //     300: {
        //       slidesPerView: 1,
        //     },
        //     780: {
        //       slidesPerView: 1,
        //     },
        //     992: {
        //       slidesPerView: 1,
        //     },
        //     1199: {
        //       slidesPerView: 1,
        //     },
        //   },
        // });
      }
    });
  });
  observer.observe(block);
}
