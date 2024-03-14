import "@testing-library/jest-dom";
import { render, cleanup, screen } from "@testing-library/svelte";
import { html } from "@playpilot/svelte-htm";
import UIInputText from "@/components/ui/UIInputText.svelte";
import { get, writable } from "svelte/store";
import userEvent from "@testing-library/user-event";

describe("UIInputText", () => {
  afterEach(() => cleanup());

  const user = userEvent.setup();

  it("should render correctly", async () => {
    render(html`<${UIInputText} label="my text" value="my input" />`);

    expect(screen.getByLabelText("my text")).toBeInTheDocument();
    expect(screen.getByLabelText("my text")).toHaveValue("my input");
  });

  it("should be disabled if disabled is true", () => {
    render(html`<${UIInputText} label="my text" disabled=${true} />`);

    expect(screen.getByLabelText("my text")).toBeDisabled();
  });

  it("updates bind value on input", async () => {
    const value = writable("my input");
    render(html`<${UIInputText} label="my text" bind:value=${value} />`);

    await user.type(screen.getByLabelText("my text"), ", add more text");
    expect(screen.getByLabelText("my text")).toHaveValue(
      "my input, add more text",
    );
    expect(get(value)).toEqual("my input, add more text");
  });

  it("trigger input event", async () => {
    const input = vi.fn();
    render(html`<${UIInputText} label="my text" on:input=${input} />`);

    await user.type(screen.getByLabelText("my text"), "my input");
    expect(input).toHaveBeenCalledTimes(8);
  });
});
