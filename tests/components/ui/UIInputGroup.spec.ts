import "@testing-library/jest-dom";
import { render, cleanup, screen } from "@testing-library/svelte";
import UIInputGroup from "@/components/ui/UIInputGroup.svelte";
import { html } from "@playpilot/svelte-htm";
import userEvent from "@testing-library/user-event";
import { get, writable } from "svelte/store";

describe("UIInputGroup", () => {
  afterEach(() => cleanup());

  const user = userEvent.setup();

  it("should render correctly", () => {
    render(
      html`<${UIInputGroup}
        items=${[
          { id: "1", label: "test1", value: "test1" },
          { id: "2", label: "test2", value: "test2" },
        ]}
      />`,
    );

    expect(screen.getAllByRole("radio")).toHaveLength(2);
    expect(screen.getByText("test1")).toBeInTheDocument();
    expect(screen.getByText("test2")).toBeInTheDocument();
  });

  it("should be disabled if disabled is true", () => {
    render(
      html`<${UIInputGroup}
        items=${[
          { id: "1", label: "test1", value: "test1" },
          { id: "2", label: "test2", value: "test2" },
        ]}
        disabled=${true}
      />`,
    );

    expect(screen.getAllByRole("radio")).toHaveLength(2);
    expect(screen.getByLabelText("test1")).toBeDisabled();
    expect(screen.getByLabelText("test2")).toBeDisabled();
  });

  it("updates selected value on click label", async () => {
    const selected = writable();

    render(
      html`<${UIInputGroup}
        items=${[
          { id: "1", label: "test1", value: "test1" },
          { id: "2", label: "test2", value: "test2" },
        ]}
        bind:selected=${selected}
      />`,
    );

    const user = userEvent.setup();
    await user.click(screen.getByLabelText("test1"));

    expect(screen.getByLabelText("test1")).toBeChecked();
    expect(screen.getByLabelText("test1")).not.toHaveClass("bg-transparent");
    expect(get(selected)).toEqual({ id: "1", label: "test1", value: "test1" });
  });

  it("selects default value", () => {
    const selected = writable({ id: "l2", label: "test2", value: "test2" });

    render(
      html`<${UIInputGroup}
        items=${[
          { id: "l1", label: "test1", value: "test1" },
          { id: "l2", label: "test2", value: "test2" },
        ]}
        bind:selected=${selected}
      />`,
    );

    expect(screen.getByLabelText("test2")).toBeChecked();
  });
});
