import "@testing-library/jest-dom";
import { render, cleanup, screen } from "@testing-library/svelte";
import UIDetails from "@/components/ui/UIDetails.svelte";
import { html } from "@playpilot/svelte-htm";
import userEvent from "@testing-library/user-event";

describe("UIDetails", () => {
  afterEach(() => cleanup());

  const user = userEvent.setup();

  it("should render correctly", () => {
    render(
      html`<${UIDetails}><slot slot="summary">My Details</slot></${UIDetails}>`,
    );
    expect(screen.getByText("My Details")).toBeInTheDocument();
  });

  it("should reveal details on click", async () => {
    render(
      html`<${UIDetails}><slot slot="summary">My Summary</slot><slot slot="details">My Details</slot></${UIDetails}>`,
    );

    await user.click(screen.getByText("My Summary"));
    expect(screen.getByText("My Details")).toBeInTheDocument();
  });

  it("should be expanded if open is true", async () => {
    render(
      html`<${UIDetails} open=${true}><slot slot="summary">My Summary</slot><slot slot="details">My Details</slot></${UIDetails}>`,
    );

    expect(screen.getByText("My Details")).toBeInTheDocument();
  });
});
