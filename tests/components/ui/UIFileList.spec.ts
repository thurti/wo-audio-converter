import "@testing-library/jest-dom";
import { render, cleanup, screen, getByRole } from "@testing-library/svelte";
import { html } from "@playpilot/svelte-htm";
import UIFileList from "@/components/ui/UIFileList.svelte";
import userEvent from "@testing-library/user-event";
import { get, writable } from "svelte/store";

describe("UIFileList", () => {
  afterEach(() => cleanup());

  const user = userEvent.setup();

  it("should render correctly with files", () => {
    const files = [new File([""], "test1.png"), new File([""], "test2.png")];

    render(
      html`<${UIFileList} files=${files} let:file>
        <div data-testid="file"></div>
      </${UIFileList}>`,
    );
    expect(screen.getAllByTestId("file")).toHaveLength(2);
  });

  it("should display text if no files", () => {
    render(html`<${UIFileList} files=${[]} />`);
    expect(screen.getByText("Please add some files.")).toBeInTheDocument();
  });
});
