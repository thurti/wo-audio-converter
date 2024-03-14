import "@testing-library/jest-dom";
import { render, cleanup, screen } from "@testing-library/svelte";
import UIInputCheckbox from "@/components/ui/UIInputCheckbox.svelte";
import { html } from "@playpilot/svelte-htm";
import userEvent from "@testing-library/user-event";
import { get, writable } from "svelte/store";

describe("UIInputCheckbox", () => {
  afterEach(() => cleanup());

  const user = userEvent.setup();

  it("should render correctly", () => {
    render(html`<${UIInputCheckbox} label="Test" />`);

    expect(screen.getByLabelText("Test")).toBeInTheDocument();
    expect(screen.getByRole("checkbox")).toBeInTheDocument();
    expect(screen.getByRole("checkbox")).not.toBeChecked();
  });

  it("should be disabled if disabled is true", () => {
    render(html`<${UIInputCheckbox} label="Test" disabled=${true} />`);

    expect(screen.getByRole("checkbox")).toBeDisabled();
  });

  it("should set checked on click", async () => {
    const checked = writable(false);
    render(html`<${UIInputCheckbox} label="Test" bind:checked=${checked} />`);

    await user.click(screen.getByLabelText("Test"));

    expect(screen.getByRole("checkbox")).toBeChecked();
    expect(get(checked)).toBe(true);
  });

  it("should trigger input event", async () => {
    const input = vi.fn();
    render(html`<${UIInputCheckbox} label="Test" on:input=${input} />`);

    await user.click(screen.getByLabelText("Test"));

    expect(input).toHaveBeenCalledTimes(1);
  });
});
