export default function decorate(block) {
    let blockData = Array.from(block.children);
    blockData.forEach(function (ele, ind) {

        ele.classList.add('more-product-inner');
        let innerElement = Array.from(ele.children);
        innerElement.forEach(function (innerele, index) {
            innerele.classList.add('more-product-list');
            Array.from(innerele.children).forEach(function (innerChildElement, innerChildInd) {
                if (innerChildInd == 0) {
                    innerChildElement.classList.add("list-heads")
                } else {
                    innerChildElement.classList.add("insurance-details-list")
                }

            })
        })



    })
}