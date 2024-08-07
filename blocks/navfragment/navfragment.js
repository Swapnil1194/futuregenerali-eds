export default function decorate(block) {
  const navFragments = Array.from(block.querySelectorAll("p"));
  navFragments.forEach((fragm) => {
    // console.log(fragm.innerHTML);
  });
}
