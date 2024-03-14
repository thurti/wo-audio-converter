import "@testing-library/jest-dom";
import { clickOutside } from "@/actions/clickOutside";
import { render, cleanup, screen } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import { html } from "@playpilot/svelte-htm";

describe("actions/clickOutside", () => {
  afterEach(() => cleanup());

  const user = userEvent.setup();

  it("trigger handler on click outside of container", async () => {
    const spy = vi.fn();
    render(html`
      <div>
        <button>outside</button>
        <div use:action=${(node) => clickOutside(node, () => spy())}>test</div>
      </div>
    `);

    expect(spy).not.toHaveBeenCalled();
    expect(screen.getByRole("button")).toBeInTheDocument();
    await user.click(screen.getByRole("button"));
    expect(spy).toHaveBeenCalledOnce();
  });

  it("does not trigger handler on click inside of container", async () => {
    const spy = vi.fn();
    render(html`
      <div>
        <button>outside</button>
        <div use:action=${(node) => clickOutside(node, () => spy())}>test</div>
      </div>
    `);

    expect(spy).not.toHaveBeenCalled();
    expect(screen.getByRole("button")).toBeInTheDocument();
    await user.click(screen.getByText("test"));
    expect(spy).not.toHaveBeenCalled();
  });

  it("triggers handler on escape key", async () => {
    const spy = vi.fn();
    render(html`
      <div>
        <button>outside</button>
        <div use:action=${(node) => clickOutside(node, () => spy())}>test</div>
      </div>
    `);

    expect(spy).not.toHaveBeenCalled();
    expect(screen.getByRole("button")).toBeInTheDocument();
    await user.keyboard("{Escape}");
    expect(spy).toHaveBeenCalledOnce();
  });

  it("removes event listeners on destroy", async () => {
    const spy = vi.fn();
    const spyRemove = vi.spyOn(document, "removeEventListener");

    const { unmount } = render(html`
      <div>
        <button>outside</button>
        <div use:action=${(node) => clickOutside(node, () => spy())}>test</div>
      </div>
    `);

    await user.click(screen.getByRole("button"));
    expect(spy).toHaveBeenCalledOnce();

    spy.mockClear();
    unmount();

    expect(spyRemove).toHaveBeenNthCalledWith(
      1,
      "click",
      expect.any(Function),
      true,
    );
    expect(spyRemove).toHaveBeenNthCalledWith(
      2,
      "keydown",
      expect.any(Function),
      true,
    );
  });
});
