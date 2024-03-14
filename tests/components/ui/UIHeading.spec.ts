import "@testing-library/jest-dom";
import { render, cleanup, screen } from "@testing-library/svelte";
import { html } from "@playpilot/svelte-htm";
import UIHeading from "@/components/ui/UIHeading.svelte";

describe("UIHeading", () => {
  afterEach(() => cleanup());

  it("should render correctly", () => {
    render(html`<${UIHeading}>My Heading</${UIHeading}>`);
    expect(screen.getByRole("heading")).toBeInTheDocument();
    expect(screen.getByRole("heading")).toHaveTextContent("My Heading");
  });

  it("should render correctly with a custom level", () => {
    render(html`<${UIHeading} level=${3}>My Heading</${UIHeading}>`);
    expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent(
      "My Heading",
    );
  });

  it("should render correctly with a custom class", () => {
    render(
      html`<${UIHeading} class="my-custom-class">My Heading</${UIHeading}>`,
    );
    expect(screen.getByRole("heading")).toHaveClass("my-custom-class");
  });
});
