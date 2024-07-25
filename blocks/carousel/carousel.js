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
  // block.innerHTML = `
  //   <div class="hmpg-swiper-container hmpgBannerSlider swipper-main">
  //       <div class="swiper-wrapper">
  //           ${renderHelper(
  //   data,
  //   `<div class="forName">
  //               <div class="swiper-slide hmpg-slide-wrap" >
  //                   <div class="container fg-container">
  //                   <div class="hmpg-slide-wrap__content">
  //                       <div class="hmpg-slide-wrap__title">
  //                       <p>
  //                           <span class="hmpg-slide-wrap__nudge">
  //                               {0.0.innerHTML}
  //                           </span>
  //                       </p>
  //                       <p>{0.1.innerText} </p>
  //                       </div>
  //                       <div class="hmpg-slide-wrap__image mb-d "> 
  //                        {1.outerHTML} 
  //                        <a href="{0.2.children.0.href}"class="hmpg-slide-wrap__button hmpg-slide-wrap__button--mob">
  //                           {0.2.innerText}
  //                        </a>
  //                       </div>
  //                       <div class="hmpg-slide-wrap__image de-d ">  
  //                        {2.outerHTML}
  //                       </div>
  //                       <a href="{0.2.children.0.href}" class="hmpg-slide-wrap__button hmpg-slide-wrap__button--desk de-d ">
  //                       {0.2.innerText}
  //                       </a>
  //                   </div>
  //                   </div>
  //               </div>
  //           </div>`
  // )}
  //       <div class="swiper-pagination"></div>
  //   </div>
  //   `;
  block.innerHTML = `<div class="glider-contain">
  <div class="glider">
    <div>your content here</div>
    <div>your content here</div>
    <div>your content here</div>
    <div>your content here</div>
  </div>

  <button aria-label="Previous" class="glider-prev">«</button>
  <button aria-label="Next" class="glider-next">»</button>
  <div role="tablist" class="dots"></div>
</div>`

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        new Glider(block.children[0].children[0], {
          slidesToShow: 3,
          dots: '#dots',
          arrows: {
            prev: '.glider-prev',
            next: '.glider-next'
          }
        })
      }
    });
  });
  observer.observe(block);
}
