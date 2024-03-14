import "@testing-library/jest-dom";
import { render, cleanup, screen } from "@testing-library/svelte";
import UIProgressBar from "@/components/ui/UIProgressBar.svelte";
import { html } from "@playpilot/svelte-htm";

describe("UIProgressBar", () => {
  afterEach(() => cleanup());

  it("should render correctly", () => {
    render(html`<${UIProgressBar} label="my progress" />`);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
    expect(screen.getByLabelText("my progress")).toBeInTheDocument();
  });

  it("renders current progress in title", () => {
    render(html`<${UIProgressBar} label="my progress" value="0.5" />`);
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "title",
      "50% Complete",
    );
  });
});
