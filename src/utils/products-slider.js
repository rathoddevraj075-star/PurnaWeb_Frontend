export const initializeSliderSync = (swiperInstance, container) => {
    const updateCssVariables = (slider) => {
      const activeSlide = slider.slides[slider.activeIndex];
      if (activeSlide) {
        const cssVariableValue = getComputedStyle(activeSlide)
          .getPropertyValue('--slide-text-color')
          .trim();
        container.style.setProperty('--slider-bullets-color', cssVariableValue);
      }
    };
  
    // Initial update
    updateCssVariables(swiperInstance);
  
    // Update on slide change
    swiperInstance.on('slideChange', () => {
      updateCssVariables(swiperInstance);
    });
  };