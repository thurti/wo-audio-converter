import "@testing-library/jest-dom";
import { render, cleanup, screen, waitFor } from "@testing-library/svelte";
import { html } from "@playpilot/svelte-htm";
import ConvertButton from "@/components/ConvertButton.svelte";
import userEvent from "@testing-library/user-event";

vi.mock("@/components/FileConverter.svelte", () => {
  return {
    convertAll: vi.fn(() => {
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve(true);
        }, 1000);
      });
    }),
    cancelAll: vi.fn(),
  };
});

describe("ConvertButton", () => {
  afterEach(() => cleanup());

  const user = userEvent.setup();

  it("should render correctly", () => {
    render(html`<${ConvertButton} />`);
    expect(screen.getByRole("button")).toHaveTextContent("Convert All");
  });

  it("should call convertAll when clicked", async () => {
    const { convertAll } = await import("@/components/FileConverter.svelte");
    render(html`<${ConvertButton} />`);

    await user.click(screen.getByRole("button"));
    expect(convertAll).toHaveBeenCalledOnce();
  });

  it("should switch buttons if converting", async () => {
    render(html`<${ConvertButton} />`);

    await user.click(screen.getByRole("button"));
    expect(screen.getByRole("button")).toHaveTextContent("Cancel");

    // Wait for convertAll to finish
    await new Promise((resolve) =>
      setTimeout(() => {
        return resolve(true);
      }, 1000)
    );

    expect(screen.getByRole("button")).toHaveTextContent("Convert All");
  });

  it("calls cancelAll when clicked while converting", async () => {
    const { cancelAll } = await import("@/components/FileConverter.svelte");
    render(html`<${ConvertButton} />`);

    await user.click(screen.getByRole("button")); //Convert All
    await user.click(screen.getByRole("button")); //Cancel
    expect(cancelAll).toHaveBeenCalledOnce();
  });

  it("should not call convertAll, cancelAll when clicked while converting", async () => {
    const { convertAll } = await import("@/components/FileConverter.svelte");
    const { cancelAll } = await import("@/components/FileConverter.svelte");

    render(html`<${ConvertButton} />`);

    await user.click(screen.getByRole("button")); //Convert All
    await user.click(screen.getByRole("button")); //Cancel
    expect(convertAll).toHaveBeenCalledOnce();
    expect(cancelAll).toHaveBeenCalledOnce();
  });

  it("should be disabled if disabled prop is true", async () => {
    render(html`<${ConvertButton} disabled=${true} />`);
    expect(screen.getByRole("button")).toBeDisabled();
  });
});
