import "@testing-library/jest-dom";
import { render, cleanup, screen } from "@testing-library/svelte";
import UIDownloadData from "@/components/ui/UIDownloadData.svelte";
import { html } from "@playpilot/svelte-htm";
import userEvent from "@testing-library/user-event";

vi.stubGlobal("URL", {
  createObjectURL: vi.fn((blob) => "mocked url data"),
  revokeObjectURL: vi.fn(),
});

describe("UIDownloadData", () => {
  afterEach(() => cleanup());

  afterAll(() => {
    vi.restoreAllMocks();
  });

  const user = userEvent.setup();

  it("should render correctly", () => {
    render(
      html`<${UIDownloadData} data="" type="" filename="">My Button</${UIDownloadData}>`,
    );
    expect(screen.getByRole("button")).toBeInTheDocument();
    expect(screen.getByRole("button")).toHaveTextContent("My Button");
  });

  it("should not be clickable if disbaled is true", () => {
    render(
      html`<${UIDownloadData} data="" type="" filename="" disabled=${true}>My Button</${UIDownloadData}>`,
    );
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("should call createObjectURL with data and type", async () => {
    const data = { foo: "bar" };
    const type = "application/json";

    render(html`<${UIDownloadData} data=${data} type=${type} filename="" />`);

    expect(URL.createObjectURL).toHaveBeenCalledWith(
      new Blob([JSON.stringify(data)], { type }),
    );
  });

  it("should create link with href set to createObjectUrl", async () => {
    const data = { foo: "bar" };
    const type = "application/json";

    render(html`<${UIDownloadData} data=${data} type=${type} filename="" />`);

    const link = screen.getByRole("link");
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "mocked url data");
  });

  it("should call revokeObjectURL on destroy", async () => {
    const data = { foo: "bar" };
    const type = "application/json";

    const { unmount } = render(
      html`<${UIDownloadData} data=${data} type=${type} filename="" />`,
    );
    unmount();

    expect(URL.revokeObjectURL).toHaveBeenCalledWith("mocked url data");
  });
});
