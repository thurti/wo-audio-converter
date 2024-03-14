import "@testing-library/jest-dom";
import { render, cleanup, screen, fireEvent } from "@testing-library/svelte";
import { html } from "@playpilot/svelte-htm";
import { get, writable } from "svelte/store";
import userEvent from "@testing-library/user-event";
import FileConverter, { convertAll } from "@/components/FileConverter.svelte";

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
const logger = writable("");
const progress = writable(0);

describe("FileConverter", () => {
  afterEach(() => cleanup());

  const user = userEvent.setup();

  it("should render correctly", async () => {
    render(
      html`<${FileConverter}
        file=${file}
        format=${format}
        settings=${settings}
        logger=${logger}
      />`,
    );

    expect(screen.getByText("test.wav")).toBeInTheDocument();
    expect(screen.getByRole("button")).toHaveTextContent("Remove");
  });

  it("should emit remove with file when button remove is clicked", async () => {
    const spy = vi.fn();
    render(
      html`<${FileConverter}
        file=${file}
        format=${format}
        settings=${settings}
        logger=${logger}
        on:remove=${spy}
      />`,
    );
    await user.click(screen.getByRole("button"));
    expect(spy).toHaveBeenCalledOnce();
  });
});
