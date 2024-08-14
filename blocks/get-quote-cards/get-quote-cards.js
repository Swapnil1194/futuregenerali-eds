export default function decorate(block) {
  let blockData = Array.from(block.children);
  let cardsWrapper = document.createElement('div');
  let parentEl = document.querySelector('.get-quote-cards.block');
  blockData.forEach(function (element, ind) {
    if (!ind) {
      element.classList.add('looking-for-label');
      Array.from(element.children).forEach(function (column, Columnindex) {
        column.classList.add('looking-for');
      })
    }
    else if (ind === blockData.length - 1) {
      element.classList.add('more');
      //   Array.from(element.children).forEach(function (column,Columnindex) {
      //     column.classList.add('looking-for');
      //  }) 
    } else {
      let column = Array.from(element.children);
      if(column.length>=3){
        column[0].classList.add('new-plan');
        column[1].classList.add('image');
        column[2].classList.add('text');
      }else{
        column[0].classList.add('image');
        column[1].classList.add('text');
       
      }
      element.classList.add("cardsContainer");
      cardsWrapper.classList.add('multiCardsContainer');
      cardsWrapper.append(element);
    }
    let more = document.querySelector('.more');
    parentEl.insertBefore(cardsWrapper, more);
    // document.querySelector('.get-quote-cards-wrapper').classList.add('dp-none');
    // block.append(cardsWrapper);
  });

}
