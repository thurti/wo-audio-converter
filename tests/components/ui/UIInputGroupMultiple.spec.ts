import "@testing-library/jest-dom";
import { render, cleanup, screen } from "@testing-library/svelte";
import UIInputGroupMultiple from "@/components/ui/UIInputGroupMultiple.svelte";
import { html } from "@playpilot/svelte-htm";
import userEvent from "@testing-library/user-event";
import { get, writable } from "svelte/store";

describe("UIInputGroupMultiple", () => {
  afterEach(() => cleanup());

  const user = userEvent.setup();

  it("renders correctly with multiple", () => {
    render(
      html`<${UIInputGroupMultiple}
        items=${[
          { id: "1", label: "test1", value: "test1" },
          { id: "2", label: "test2", value: "test2" },
        ]}
      />`,
    );

    expect(screen.getAllByRole("checkbox")).toHaveLength(2);
    expect(screen.getByText("test1")).toBeInTheDocument();
    expect(screen.getByText("test2")).toBeInTheDocument();
  });

  it("should be disabled if disabled is true", () => {
    render(
      html`<${UIInputGroupMultiple}
        items=${[
          { id: "1", label: "test1", value: "test1" },
          { id: "2", label: "test2", value: "test2" },
        ]}
        disabled=${true}
      />`,
    );

    expect(screen.getAllByRole("checkbox")).toHaveLength(2);
    expect(screen.getByLabelText("test1")).toBeDisabled();
    expect(screen.getByLabelText("test2")).toBeDisabled();
  });

  it("updates multiple selected value on click label", async () => {
    const selected = writable();
    render(
      html`<${UIInputGroupMultiple}
        items=${[
          { id: "1", label: "test1", value: "test1" },
          { id: "2", label: "test2", value: "test2" },
        ]}
        bind:selected=${selected}
      />`,
    );
    await user.click(screen.getByLabelText("test1"));
    await user.click(screen.getByLabelText("test2"));

    expect(screen.getByLabelText("test1")).not.toHaveClass("bg-transparent");
    expect(screen.getByLabelText("test2")).not.toHaveClass("bg-transparent");
    expect(screen.getByLabelText("test1")).toBeChecked();
    expect(screen.getByLabelText("test2")).toBeChecked();

    expect(get(selected)).toEqual([
      { id: "1", label: "test1", value: "test1" },
      { id: "2", label: "test2", value: "test2" },
    ]);
  });

  it("selects default value", () => {
    const selected = writable([{ id: "l2", label: "test2", value: "test2" }]);

    render(
      html`<${UIInputGroupMultiple}
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
