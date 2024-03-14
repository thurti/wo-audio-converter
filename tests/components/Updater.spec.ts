import "@testing-library/jest-dom";
import { render, cleanup, screen, fireEvent } from "@testing-library/svelte";
import { html } from "@playpilot/svelte-htm";
import { get, writable } from "svelte/store";
import userEvent from "@testing-library/user-event";
import Updater from "@/components/Updater.svelte";
import { isConverting } from "@/store";

const mockNeedRefresh = writable(false);
const mockUpdateServiceWorker = vi.fn();

vi.mock("virtual:pwa-register/svelte", () => {
  return {
    useRegisterSW: () => {
      return {
        needRefresh: mockNeedRefresh,
        updateServiceWorker: mockUpdateServiceWorker,
      };
    },
  };
});

describe("Updater", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    cleanup();
  });

  const user = userEvent.setup();

  it("should render update button if needRefresh is true", async () => {
    mockNeedRefresh.set(false);
    const { container } = render(html`<${Updater} />`);
    expect(container).not.toHaveTextContent("Update");

    await mockNeedRefresh.set(true);
    expect(screen.getByRole("button")).toHaveTextContent("Update");
  });

  it("should call updateServiceWorker when click update button", async () => {
    mockNeedRefresh.set(true);
    render(html`<${Updater} />`);
    await user.click(screen.getByRole("button"));
    expect(mockUpdateServiceWorker).toHaveBeenCalledWith(true); //true to reload browser
  });

  it("update button should be disabled if $isConverting is true", async () => {
    mockNeedRefresh.set(true);
    isConverting.set(true);
    render(html`<${Updater} />`);

    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("should call clearTimeout on destroy", async () => {
    mockNeedRefresh.set(true);
    vi.spyOn(global, "clearTimeout");
    const { unmount } = render(html`<${Updater} />`);
    unmount();
    expect(clearTimeout).toHaveBeenCalled();
  });
});
