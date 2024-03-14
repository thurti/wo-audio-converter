import "@testing-library/jest-dom";
import { render, cleanup, screen } from "@testing-library/svelte";
import { html } from "@playpilot/svelte-htm";
import Settings from "@/components/Settings.svelte";
import userEvent from "@testing-library/user-event";
import { get, writable } from "svelte/store";

const formats = {
  id: "format",
  label: "Format",
  value: "format",
  options: [
    { id: "wav", label: "wav", value: "wav", mimetype: "audio/wav" },
    { id: "mp3", label: "mp3", value: "mp3", mimetype: "audio/mp3" },
  ],
};

const settings = {
  mp3: [
    {
      id: "bitrate",
      label: "Bitrate",
      value: "bitrate",
      options: [
        { id: "mp3-vbr-0", label: "VBR 245 kbit/s", value: "-q:a 0" },
        { id: "mp3-vbr-2", label: "VBR 190 kbit/s", value: "-q:a 2" },
      ],
    },
    {
      id: "sample-rate",
      label: "Sample Rate",
      value: "sample-rate",
      options: [
        { id: "8", label: "8 kHz", value: "-ar 8000" },
        { id: "16", label: "16 kHz", value: "-ar 16000" },
      ],
    },
  ],
};

const defaults = {
  format: {
    id: "mp3",
    label: "mp3",
    value: "mp3",
    mimetype: "audio/mp3",
  },
  settings: {
    bitrate: {
      id: "mp3-vbr-0",
      label: "245 kbit/s",
      value: "-q:a 0",
    },
    "sample-rate": { id: "16", label: "16 kHz", value: "-ar 16000" },
  },
};

describe("Settings", () => {
  afterEach(() => cleanup());

  const user = userEvent.setup();

  it("should render correctly", async () => {
    render(
      html`<${Settings}
        formats=${formats}
        settings=${settings}
        defaultSettings=${defaults.settings}
        selectedFormat=${defaults.format}
      />`,
    );
    expect(screen.getByText("Format")).toBeInTheDocument();
    expect(screen.getByLabelText("wav")).toBeInTheDocument();
    expect(screen.getByLabelText("mp3")).toBeInTheDocument();

    await user.click(screen.getByText("Advanced Settings"));

    expect(screen.getByText("Bitrate")).toBeInTheDocument();
    expect(screen.getByLabelText("VBR 245 kbit/s")).toBeInTheDocument();
    expect(screen.getByLabelText("VBR 190 kbit/s")).toBeInTheDocument();
    expect(screen.getByLabelText("VBR 245 kbit/s")).toBeChecked();
  });

  it("should update selectedFormat", async () => {
    const selectedFormat = writable({});

    render(
      html`<${Settings}
        formats=${formats}
        settings=${settings}
        defaultSettings=${defaults.settings}
        bind:selectedFormat=${selectedFormat}
      />`,
    );

    expect(screen.getByLabelText("mp3")).not.toBeChecked();
    await user.click(screen.getByLabelText("mp3"));

    expect(screen.getByLabelText("mp3")).toBeChecked();
    expect(get(selectedFormat)).toEqual({
      id: "mp3",
      label: "mp3",
      value: "mp3",
      mimetype: "audio/mp3",
    });
  });

  it("should update selectedSettings", async () => {
    const selectedSettings = writable({});

    render(
      html`<${Settings}
        formats=${formats}
        settings=${settings}
        defaultSettings=${defaults.settings}
        bind:selectedSettings=${selectedSettings}
      />`,
    );

    await user.click(screen.getByLabelText("mp3"));
    await user.click(screen.getByText("Advanced Settings"));
    await user.click(screen.getByLabelText("VBR 190 kbit/s"));

    expect(get(selectedSettings)).toEqual({
      bitrate: { id: "mp3-vbr-2", label: "VBR 190 kbit/s", value: "-q:a 2" },
      "sample-rate": { id: "16", label: "16 kHz", value: "-ar 16000" },
    });
  });
});
