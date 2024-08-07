
import swiperMin from '../../common/swiper/swiper.min.js';
import { embedYoutube, loadEmbed } from '../embed/embed.js';
swiperMin();
export default function decorate(block) {
  const carouselitem = Array.from(block.children);
  let config = {};
  let prev;
  let next;
  const swiperContainer = document.createElement('div');
  swiperContainer.dataset.swiperContainer = 'swiper-wrapper';
  const dots = document.createElement('div');
  carouselitem.forEach((item, index) => {
    if (carouselitem.length === index + 1) {
      const [configData, prevEl, nextEl] = item.children;
      config = JSON.parse(configData.innerText);
      prev = prevEl;
      next = nextEl;
      prev.classList.add('swiper-prev');
      next.classList.add('swiper-next');
    } else {
      item.dataset.rowIndex = `row-${index}`;
      item.classList.add('swiper-slide');
      const childwrap = document.createElement('div');
      childwrap.dataset.columnWrapper = 'column-wrapper';
      Array.from(item.children).forEach((el, index) => {
        el.dataset.columnIndex = `column-${index}`;
        if(block.classList.contains('embed')){
          const link = el.innerText.trim();
  // const url = new URL(link);

  //         const div = document.createElement('div');
  //         div.innerHTML = embedYoutube(url);;
  //         childwrap.append(div);
          childwrap.append(loadEmbed(el, link));
        }else{
            block.classList.add('mySwiper');
            childwrap.append(el);
        }
      });
      item.append(childwrap);
      swiperContainer.append(item);
    }
  });
  block.innerHTML = '';
  block.closest('.swiper-wrapper').classList.add('swiperContainer');
  block.closest('.swiper-wrapper').classList.remove('swiper-wrapper');
  block.appendChild(swiperContainer);
//   block.append(dots);
//   block.append(prev);
//   block.append(next);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // config.dots = config.dots && dots;
        // config.arrows = {};
        // config.arrows.prev = config.prev && prev;
        // config.arrows.next = config.next && next;
        new Swiper(".mySwiper", {
            effect: "coverflow",
            grabCursor: true,
            centeredSlides: true,
            loop:true,
            slidesPerView: "auto",
            coverflowEffect: {
              rotate: 0,
              stretch: 0,
              depth: 150,
              modifier: 2.5,
              slideShadows: true,
            },
            autoplay:{
          
              delay:44000,
              disableOnInteraction:false,
            }
          
          });
      }
    });
  });
  observer.observe(block);
}
