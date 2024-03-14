import "@testing-library/jest-dom";
import { render, cleanup, screen } from "@testing-library/svelte";
import { html } from "@playpilot/svelte-htm";
import UIDialog from "@/components/ui/UIDialog.svelte";
import userEvent from "@testing-library/user-event";

describe("UIDialog", () => {
  beforeAll(() => {
    HTMLDialogElement.prototype.showModal = vi.fn();
    HTMLDialogElement.prototype.close = vi.fn();
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  const user = userEvent.setup();

  it("should render correctly", async () => {
    render(
      html`<${UIDialog} button=${{
        title: "my title",
      }} href="google.de">My Content</${UIDialog}>`,
    );
    expect(screen.getByRole("button")).toBeInTheDocument();
    expect(screen.getByRole("button")).toHaveTextContent("my title");
    expect(screen.getByText("My Content")).toBeInTheDocument();
  });

  it("should open dialog on click", async () => {
    const spyOpen = vi.spyOn(HTMLDialogElement.prototype, "showModal");
    render(
      html`<${UIDialog} button=${{
        title: "my title",
      }} href="google.de">My Content</${UIDialog}>`,
    );

    await user.click(screen.getByRole("button"));
    expect(spyOpen).toHaveBeenCalled();
  });

  it("should close dialog on click", async () => {
    const spyClose = vi.spyOn(HTMLDialogElement.prototype, "close");
    render(
      html`<${UIDialog} button=${{
        title: "my title",
      }} href="google.de">My Content</${UIDialog}>`,
    );

    await user.click(screen.getByTitle("Close"));
    expect(spyClose).toHaveBeenCalled();
  });

  it("should close dialog on click outside", async () => {
    const spyClose = vi.spyOn(HTMLDialogElement.prototype, "close");
    render(
      html`<${UIDialog} button=${{
        title: "my title",
      }} href="google.de">My Content</${UIDialog}>`,
    );

    await user.click(document.body);
    expect(spyClose).toHaveBeenCalled();
  });

  it("should close on destroy", async () => {
    const spyClose = vi.spyOn(HTMLDialogElement.prototype, "close");
    const { unmount } = render(
      html`<${UIDialog} button=${{
        title: "my title",
      }} href="google.de">My Content</${UIDialog}>`,
    );

    unmount();
    expect(spyClose).toHaveBeenCalled();
  });
});
