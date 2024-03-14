import "@testing-library/jest-dom";
import { render, cleanup, screen } from "@testing-library/svelte";
import { html } from "@playpilot/svelte-htm";
import UIFloatingButton from "@/components/ui/UIFloatingButton.svelte";
import userEvent from "@testing-library/user-event";

describe("UIFloatingButton", () => {
  afterEach(() => cleanup());

  const user = userEvent.setup();

  it("should render correctly", async () => {
    render(
      html`<${UIFloatingButton} title="my title" href="google.de">info<//>`,
    );
    expect(screen.getByRole("link")).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveTextContent("info");
    expect(screen.getByRole("link")).toHaveAttribute("title", "my title");
    expect(screen.getByRole("link")).toHaveAttribute("href", "google.de");
  });
});
