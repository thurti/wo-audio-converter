import "@testing-library/jest-dom";
import { render, cleanup, screen, fireEvent } from "@testing-library/svelte";
import { html } from "@playpilot/svelte-htm";
import Setting from "@/components/Setting.svelte";
import { get, writable } from "svelte/store";
import userEvent from "@testing-library/user-event";

const options = [
  { id: "wav", label: "wav", value: "wav" },
  { id: "mp3", label: "mp3", value: "mp3" },
];

describe("Setting", () => {
  afterEach(() => cleanup());

  const user = userEvent.setup();

  it("should render correctly", () => {
    render(html`<${Setting} label="My Heading" options=${options} />`);

    expect(screen.getByRole("heading")).toHaveTextContent("My Heading");
    expect(screen.getAllByRole("radio")).toHaveLength(2);
    expect(screen.getByLabelText("wav")).toBeInTheDocument();
    expect(screen.getByLabelText("mp3")).toBeInTheDocument();
  });

  it("it selects if selected has a default", () => {
    const selected = { id: "mp3", label: "mp3", value: "mp3" };
    render(html`<${Setting} options=${options} selected=${selected} />`);

    expect(screen.getByLabelText("mp3")).toBeChecked();
  });

  it("it binds to selected", async () => {
    const selected = writable(null);
    render(html`<${Setting} options=${options} bind:selected=${selected} />`);
    await user.click(screen.getByLabelText("mp3"));

    expect(get(selected)).toEqual({
      id: "mp3",
      label: "mp3",
      value: "mp3",
    });
  });

  it("triggers update:selected event with {id, selected}", async () => {
    const spy = vi.fn();
    const { component } = render(Setting, {
      props: { id: "bitrate", options },
    });
    component.$on("update:selected", (e) => spy(e.detail));

    await user.click(screen.getByLabelText("mp3"));

    expect(spy).toHaveBeenCalledWith({
      id: "bitrate",
      selected: { id: "mp3", label: "mp3", value: "mp3" },
    });
  });
});
