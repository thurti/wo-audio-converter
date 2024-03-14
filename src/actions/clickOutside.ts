export function clickOutside(node: HTMLElement, handler: (e: Event) => void) {
  const handleClick = (event: MouseEvent) => {
    if (
      node &&
      event.target instanceof Node &&
      !node.contains(event.target) &&
      !event.defaultPrevented
    ) {
      handler(event);
    }
  };
  const handleEscape = (event: KeyboardEvent) => {
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
