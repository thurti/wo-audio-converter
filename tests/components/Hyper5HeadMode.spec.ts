import "@testing-library/jest-dom";
import { render, cleanup, screen, fireEvent } from "@testing-library/svelte";
import { html } from "@playpilot/svelte-htm";
import { get, writable } from "svelte/store";
import userEvent from "@testing-library/user-event";
import Hyper5HeadMode from "@/components/Hyper5HeadMode.svelte";
import { logger, selectedFormat, selectedSettings } from "@/store";

const file = new File(["test"], "test.wav", {
  type: "audio/wav",
});
const format = { id: "mp3", label: "mp3", value: "mp3", mimetype: "audio/mp3" };
const settings = {
  "bit-depth": { id: "16", label: "16 bit", value: "-acodec pcm_s16le" },
  "sample-rate": {
    id: "44.1",
    label: "44.1 kHz",
    value: "-ar 44100",
  },
};

describe("Hyper5HeadMode", () => {
  afterEach(() => cleanup());

  const user = userEvent.setup();

  it("should render correctly", async () => {
    render(html`<${Hyper5HeadMode} open=${true} />`);
    expect(screen.getByText("Expert Stuff")).toBeInTheDocument();
    expect(screen.getByLabelText("Enable Custom Command")).toBeInTheDocument();
    expect(screen.getByLabelText("FFmpeg Output")).toBeInTheDocument();
  });

  it("enable custom command input when custom command is selected", async () => {
    const { container } = render(html`<${Hyper5HeadMode} open=${true} />`);
    expect(screen.getByLabelText("Enable Custom Command")).not.toBeChecked();
    await user.click(screen.getByLabelText("Enable Custom Command"));
    expect(container.querySelector('input[type="text"]')).toBeEnabled();
  });
});
