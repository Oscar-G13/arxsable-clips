import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import { SignIn } from "./sign-in";
import { signIn } from "../../lib/auth-client";

const replace = vi.fn();
const refresh = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    replace,
    refresh,
  }),
}));

vi.mock("../../lib/auth-client", () => ({
  signIn: {
    username: vi.fn(),
  },
}));

describe("SignIn", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows the logo-led private studio surface without a typed company wordmark", () => {
    render(<SignIn />);

    expect(screen.getByRole("img", { name: "Arx Clips" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Welcome back." })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Open studio" })).toBeInTheDocument();
    expect(screen.getByLabelText("Username")).toHaveAttribute("autocomplete", "username");
    expect(screen.queryByText("ARX SABLE")).not.toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("reveals and hides the password on request", async () => {
    const user = userEvent.setup();
    render(<SignIn />);

    const password = screen.getByLabelText("Password");
    expect(password).toHaveAttribute("type", "password");
    await user.click(screen.getByRole("button", { name: "Show password" }));
    expect(password).toHaveAttribute("type", "text");
    await user.click(screen.getByRole("button", { name: "Hide password" }));
    expect(password).toHaveAttribute("type", "password");
  });

  it("shows the auth response when sign in fails", async () => {
    vi.mocked(signIn.username).mockResolvedValue({
      error: { message: "Invalid username or password" },
    } as never);
    const user = userEvent.setup();

    render(<SignIn />);

    await user.type(screen.getByLabelText("Username"), "oscar");
    await user.type(screen.getByLabelText("Password"), "Password123!");
    await user.click(screen.getByRole("button", { name: "Open studio" }));

    expect(await screen.findByRole("alert")).toHaveTextContent("Invalid username or password");
  });

  it("signs in with a username and redirects to the dashboard", async () => {
    vi.mocked(signIn.username).mockResolvedValue({ error: null } as never);
    const user = userEvent.setup();

    render(<SignIn />);

    await user.type(screen.getByLabelText("Username"), "oscar");
    await user.type(screen.getByLabelText("Password"), "Password123!");
    await user.click(screen.getByRole("button", { name: "Open studio" }));

    expect(signIn.username).toHaveBeenCalledWith({ username: "oscar", password: "Password123!" });
    await waitFor(() => expect(replace).toHaveBeenCalledWith("/dashboard"));
    expect(refresh).toHaveBeenCalled();
  });
});
