export function clickOutside(node, handler) {
  const handleClick = (event) => {
    if (node && !node.contains(event.target) && !event.defaultPrevented) {
      handler(event);
    }
  };
  const handleEscape = (event) => {
    if (event.key === "Escape") {
      handler(event);
    }
  };
  document.addEventListener("keydown", handleEscape, true);
  document.addEventListener("click", handleClick, true);
  return {
    destroy() {
      document.removeEventListener("click", handleClick, true);
      document.removeEventListener("keydown", handleEscape, true);
    },
  };
}
