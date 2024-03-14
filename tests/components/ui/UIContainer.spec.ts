import "@testing-library/jest-dom";
import { render, cleanup, screen } from "@testing-library/svelte";
import UIContainer from "@/components/ui/UIContainer.svelte";
import { html } from "@playpilot/svelte-htm";

describe("UIContainer", () => {
  afterEach(() => cleanup());

  it("should render correctly", () => {
    render(html`<${UIContainer}>My Container</${UIContainer}>`);
    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.getByRole("main")).toHaveTextContent("My Container");
  });

  it("adds class isOpen to container when isOpen is true", () => {
    render(html`<${UIContainer} isOpen=${true}>My Container</${UIContainer}>`);
    expect(screen.getByRole("main")).toHaveClass("isOpen");
  });

  it("adds class !items-start to .inner container if center is false", () => {
    const { container } = render(
      html`<${UIContainer} center=${false}>My Container</${UIContainer}>`,
    );
    expect(container.querySelector("main .inner")).toHaveClass("!items-start");
  });
});
