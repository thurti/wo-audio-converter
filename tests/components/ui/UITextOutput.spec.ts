import "@testing-library/jest-dom";
import { render, cleanup, screen } from "@testing-library/svelte";
import { html } from "@playpilot/svelte-htm";
import UITextOutput from "@/components/ui/UITextOutput.svelte";
import { get, writable } from "svelte/store";
import userEvent from "@testing-library/user-event";
import { tick } from "svelte";

describe("UITextOutput", () => {
  afterEach(() => cleanup());

  const user = userEvent.setup();

  it("should render correctly", async () => {
    render(html`<${UITextOutput} label="my text" value="asd" />`);

    expect(screen.getByLabelText("my text")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toHaveValue("asd");
  });
});
