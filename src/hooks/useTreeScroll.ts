import { useEffect } from "react";

/**
 * Hook to scroll the tree container to the right edge when nodes are generated
 * @param shouldScroll Whether to trigger a scroll
 */
export const useTreeScroll = (shouldScroll: boolean) => {
  useEffect(() => {
    if (shouldScroll) {
      const scrollContainer = document.getElementById("tree-scroll-container");
      if (scrollContainer) {
        // Execute immediately and then again after a brief delay to ensure it catches DOM updates
        scrollContainer.scrollTo({
          left: scrollContainer.scrollWidth,
          behavior: "smooth",
        });

        setTimeout(() => {
          scrollContainer.scrollTo({
            left: scrollContainer.scrollWidth,
            behavior: "smooth",
          });
        }, 50); // Reduced delay for quicker response
      }
    }
  }, [shouldScroll]);
};

/**
 * Scroll the tree container to the right edge programmatically
 */
export const scrollTreeToRight = () => {
  const scrollContainer = document.getElementById("tree-scroll-container");
  if (scrollContainer) {
    // Execute immediately for responsive feel
    scrollContainer.scrollTo({
      left: scrollContainer.scrollWidth,
      behavior: "smooth",
    });

    // Also schedule another scroll after a tiny delay to catch any DOM updates
    requestAnimationFrame(() => {
      if (scrollContainer) {
        scrollContainer.scrollTo({
          left: scrollContainer.scrollWidth,
          behavior: "smooth",
        });
      }
    });
  }
};
