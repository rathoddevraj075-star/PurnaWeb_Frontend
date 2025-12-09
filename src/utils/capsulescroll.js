
export function initCapsuleScroll(rotation = 30) {
  const images = document.querySelectorAll(".wt-parallax__img");
  if (!images.length) return;

  
  document
    .querySelectorAll(".wt-parallax__gallery__item")
    .forEach((item, index) => {
      const img = item.querySelector(".wt-parallax__img");
      if (img) {
        img.classList.add(
          index % 2 === 0 ? "wt-parallax__img--odd" : "wt-parallax__img--even"
        );
      }
    });

  const maxRotation = parseInt(rotation, 10) || 5;

  const onScroll = () => {
    images.forEach((image) => {
      const rect = image.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      if (rect.top < windowHeight) {
        let visiblePercent = ((windowHeight - rect.top) / windowHeight) * 100;
        let rotationDegree = Math.min(
          (visiblePercent / 100) * maxRotation,
          maxRotation
        );

        if (image.classList.contains("wt-parallax__img--odd")) {
          rotationDegree *= -1;
        }

        window.requestAnimationFrame(() => {
          image.style.transform = `translate3d(0, 0, 0) rotate(${rotationDegree}deg)`;
        });
      }
    });
  };

  document.addEventListener("scroll", onScroll, { passive: true });
}
