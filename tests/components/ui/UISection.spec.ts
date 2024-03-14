import "@testing-library/jest-dom";
import { render, cleanup, screen, getByRole } from "@testing-library/svelte";
import { html } from "@playpilot/svelte-htm";
import UISection from "@/components/ui/UISection.svelte";

describe("UISection", () => {
  afterEach(() => cleanup());

  it("should render correctly", () => {
    const { container } = render(
      html`<${UISection} id="test-id">
        asd
      </${UISection}>`,
    );
    expect(container.querySelector("section")).toHaveAttribute("id", "test-id");
    expect(screen.getByText("asd")).toBeInTheDocument();
  });

  it("should render heading slot", () => {
    render(
      html`<${UISection} id="test-id">
        <slot slot="heading">test-heading</slot>
        </${UISection}>`,
    );
    expect(screen.getByRole("heading")).toHaveTextContent("test-heading");
  });
});
