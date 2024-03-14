import "@testing-library/jest-dom";
import { get, writable } from "svelte/store";
import { render, cleanup, screen, fireEvent } from "@testing-library/svelte";
import userEvent from "@testing-library/user-event";
import { html } from "@playpilot/svelte-htm";
import UIFileDrop from "@/components/ui/UIFileDrop.svelte";

describe("UIFileDrop", () => {
  afterEach(() => cleanup());

  const user = userEvent.setup();

  it("should render correctly", () => {
    const { container } = render(UIFileDrop);
    expect(container.querySelector(".file-dropzone")).toBeInTheDocument();

    const input = screen.getByLabelText("Add File");
    expect(input).toBeInTheDocument();
    expect(input).not.toHaveAttribute("accept");
    expect(input).not.toHaveAttribute("multiple");
  });

  it("sets file input options from props", () => {
    render(UIFileDrop, {
      props: {
        label: "load stuff",
        accept: "image/*",
        multiple: true,
      },
    });

    const input = screen.getByLabelText("load stuff");
    expect(input).toHaveAttribute("accept", "image/*");
    expect(input).toHaveAttribute("multiple");
  });

  it("set files from input", async () => {
    const myFiles = writable([]);
    render(
      html`<${UIFileDrop} bind:files=${myFiles} multiple="${true}"></${UIFileDrop}>`,
    );

    const input = screen.getByLabelText("Add File");
    await user.upload(input, [
      new File(["a"], "test1.png"),
      new File(["b"], "test2.png"),
    ]);

    const filesList = get(myFiles);
    expect(filesList.length).toBe(2);
    expect(filesList[0].name).toBe("test1.png");
    expect(filesList[1].name).toBe("test2.png");
  });

  it("sets files from drag and drop", async () => {
    const myFiles = writable([]);
    const { container } = render(
      html`<${UIFileDrop} bind:files=${myFiles} multiple="${true}"></${UIFileDrop}>`,
    );

    const dropzone = container.querySelector(".file-dropzone");
    await fireEvent.drop(dropzone, {
      dataTransfer: {
        files: [new File([""], "test1.png"), new File([""], "test2.png")],
      },
    });

    const filesList = get(myFiles);
    expect(filesList.length).toBe(2);
    expect(filesList[0].name).toBe("test1.png");
    expect(filesList[1].name).toBe("test2.png");
  });

  it("sets only one file from drag and drop if multiple false", async () => {
    const myFiles = writable([]);
    const { container } = render(
      html`<${UIFileDrop} bind:files=${myFiles} multiple="${false}"></${UIFileDrop}>`,
    );

    const dropzone = container.querySelector(".file-dropzone");
    await fireEvent.drop(dropzone, {
      dataTransfer: {
        files: [new File([""], "test1.png"), new File([""], "test2.png")],
      },
    });

    const filesList = get(myFiles);
    expect(filesList.length).toBe(1);
    expect(filesList[0].name).toBe("test1.png");
  });

  it("does not set files from drag and drop if wrong type", async () => {
    const myFiles = writable([]);
    const { container } = render(
      html`<${UIFileDrop} bind:files=${myFiles} accept="audio/*, video/*" multiple="${true}"></${UIFileDrop}>`,
    );

    const dropzone = container.querySelector(".file-dropzone");
    await fireEvent.drop(dropzone, {
      dataTransfer: {
        files: [
          new File([""], "test1.wav", { type: "audio/wav" }),
          new File([""], "test2.txt", { type: "text/plain" }),
          new File([""], "test2.mp4", { type: "video/mp4" }),
        ],
      },
    });

    expect(get(myFiles).length).toBe(2);
  });

  it("fires change event on file input", async () => {
    let eventData;
    const handleChange = vi.fn((event) => (eventData = event.detail));

    render(
      html`<${UIFileDrop}
        on:change=${handleChange}
        multiple="${true}"
      ></${UIFileDrop}>`,
    );

    const input = screen.getByLabelText("Add File");
    const files = [new File([""], "test1.png"), new File([""], "test2.png")];
    await user.upload(input, files);

    expect(handleChange).toBeCalledTimes(1);
    expect(eventData).toEqual(files);
  });

  it("fires change event on drag and drop", async () => {
    let eventData;
    const handleChange = vi.fn((event) => (eventData = event.detail));

    const { container } = render(
      html`<${UIFileDrop}
        on:change=${handleChange}
        multiple="${true}"
      ></${UIFileDrop}>`,
    );

    const dropzone = container.querySelector(".file-dropzone");
    const files = [new File([""], "test1.png"), new File([""], "test2.png")];
    await fireEvent.drop(dropzone, {
      dataTransfer: {
        files,
      },
    });

    expect(handleChange).toBeCalledTimes(1);
    expect(eventData).toEqual(files);
  });

  it("it ignores adding same files", async () => {
    let eventData;
    const handleChange = vi.fn((event) => (eventData = event.detail));

    const { container } = render(
      html`<${UIFileDrop}
        on:change=${handleChange}
        multiple="${true}"
      ></${UIFileDrop}>`,
    );

    const dropzone = container.querySelector(".file-dropzone");
    const files = [new File([""], "test1.png"), new File([""], "test2.png")];
    await fireEvent.drop(dropzone, {
      dataTransfer: {
        files,
      },
    });
    await fireEvent.drop(dropzone, {
      dataTransfer: {
        files,
      },
    });

    expect(handleChange).toBeCalledTimes(2);
    expect(eventData).toEqual(files);
  });

  it("show max allowed filesize in MB", async () => {
    const { container } = render(
      html`<${UIFileDrop}
        maxFileSizeMb="${10}"
      ></${UIFileDrop}>`,
    );

    expect(screen.getByText("(max 10 MB)")).toBeInTheDocument();
  });

  it("checks for filesize on input", async () => {
    const myFiles = writable([]);
    const { container } = render(
      html`<${UIFileDrop}
        bind:files=${myFiles}
        multiple="${true}"
        maxFileSizeMb="${2}"
      ></${UIFileDrop}>`,
    );

    const input = screen.getByLabelText("Add File");
    await user.upload(input, [
      new File([new Uint8Array(2.1 * 1024 * 1024)], "test1.png"),
      new File([new Uint8Array(1.9 * 1024 * 1024)], "test2.png"),
    ]);

    expect(get(myFiles).length).toBe(1);
    expect(get(myFiles)[0].name).toBe("test2.png");

    expect(
      screen.getByText(
        "File test1.png is too large. Maximum file size is 2 MB.",
      ),
    ).toBeInTheDocument();
  });

  it("checks for filesize on drag and drop", async () => {
    const myFiles = writable([]);
    const { container } = render(
      html`<${UIFileDrop}
        bind:files=${myFiles}
        multiple="${true}"
        maxFileSizeMb="${2}"
      ></${UIFileDrop}>`,
    );

    const dropzone = container.querySelector(".file-dropzone");
    await fireEvent.drop(dropzone, {
      dataTransfer: {
        files: [
          new File([new Uint8Array(2.1 * 1024 * 1024)], "test1.png"),
          new File([new Uint8Array(1.9 * 1024 * 1024)], "test2.png"),
        ],
      },
    });

    expect(get(myFiles).length).toBe(1);
    expect(get(myFiles)[0].name).toBe("test2.png");

    expect(
      screen.getByText(
        "File test1.png is too large. Maximum file size is 2 MB.",
      ),
    ).toBeInTheDocument();
  });
});
