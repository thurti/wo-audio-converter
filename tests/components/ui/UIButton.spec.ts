import "@testing-library/jest-dom";
import { render, cleanup, screen } from "@testing-library/svelte";
import UIButton from "@/components/ui/UIButton.svelte";
import { html } from "@playpilot/svelte-htm";
import userEvent from "@testing-library/user-event";

describe("UIButton", () => {
  afterEach(() => cleanup());

  const user = userEvent.setup();

  it("should render correctly", () => {
    render(html`<${UIButton}>My Button</${UIButton}>`);
    expect(screen.getByRole("button")).toBeInTheDocument();
    expect(screen.getByRole("button")).toHaveTextContent("My Button");
  });

  it("adds button title", () => {
    render(UIButton, { props: { title: "my label" } });
    expect(screen.getByRole("button")).toHaveAccessibleDescription("my label");
  });

  it("adds button label for", () => {
    render(
      html`<${UIButton} as="label" labelFor="myInput">My Button</${UIButton}>`,
    );
    expect(
      screen.getByText("My Button", { selector: '[for="myInput"]' }),
    ).toBeInTheDocument();
  });

  it("adds disable", () => {
    render(UIButton, { props: { disabled: true } });
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("adds small classes", () => {
    render(UIButton, { props: { small: true } });
    expect(screen.getByRole("button")).toHaveClass("small");
  });

  it("adds outline classes", () => {
    render(UIButton, { props: { outline: true } });
    expect(screen.getByRole("button")).toHaveClass("outlined");
  });

  it("adds highlight classes", () => {
    render(UIButton, { props: { highlight: true } });
    expect(screen.getByRole("button")).toHaveClass("highlight");
  });

  it("adds waiting dots", () => {
    const { container } = render(UIButton, { props: { isWaiting: true } });
    expect(container.querySelector(".waiting-animation")).toBeInTheDocument();
  });

  it("renders as label", () => {
    render(
      html`<${UIButton} as="label" labelFor="myInput">My Button</${UIButton}><input id="myInput" />`,
    );
    expect(screen.getByLabelText("My Button")).toBeInTheDocument();
  });

  it("renders as anchor", () => {
    render(html`<${UIButton} as="a" href="google.de">My Button</${UIButton}>`);
    expect(screen.getByRole("link")).toBeInTheDocument();
    expect(screen.getByRole("link")).toHaveAttribute("href", "google.de");
  });

  it("renders title as button text", () => {
    render(UIButton, { props: { title: "my label" } });
    expect(screen.getByRole("button")).toHaveTextContent("my label");
  });

  it("triggers click event", async () => {
    const mock = vi.fn();
    render(html`<${UIButton} on:click=${mock}>My Button</${UIButton}>`);
    await user.click(screen.getByRole("button"));
    expect(mock).toHaveBeenCalled();
  });
});
