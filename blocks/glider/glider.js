import Glider from "../../common/carousel/glider.min.js";

export default function decorate(block) {
  const carouselitem = Array.from(block.children);
  const gliderContainer = document.createElement("div");
  const dots = document.createElement("div");
  for (let index = 0; index < block.children.length; index++) {
    const element = block.children[index];
    gliderContainer.append(element);
  }
  //   carouselitem.forEach(function (item) {
  //   });
  block.innerHTML = "";
  block.appendChild(gliderContainer);
  block.append(dots);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        new Glider(block.children[0], {
          slidesToShow: 1,
          slidesToScroll: 1,
          draggable: true,
          dots,
          // arrows: {
          //   prev: ".glider-prev",
          //   next: ".glider-next",
          // },
        });
      }
    });
  });
  observer.observe(block);
}
