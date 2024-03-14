import "@testing-library/jest-dom";
import { render, cleanup, screen } from "@testing-library/svelte";
import { html } from "@playpilot/svelte-htm";
import UIWaitingDots from "@/components/ui/UIWaitingDots.svelte";
import userEvent from "@testing-library/user-event";

describe("UIWaitingDots", () => {
  afterEach(() => cleanup());

  const user = userEvent.setup();

  it("should render correctly", async () => {
    const { container } = render(html`<${UIWaitingDots} show=${true} />`);

    expect(document.querySelector(".waiting-animation")).toBeInTheDocument();
  });

  it("should not render if show is false", async () => {
    const { container } = render(html`<${UIWaitingDots} show=${false} />`);

    expect(
      document.querySelector(".waiting-animation"),
    ).not.toBeInTheDocument();
  });
});
