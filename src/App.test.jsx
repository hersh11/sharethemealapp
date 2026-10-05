import { fireEvent, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { addDays, toDateInputValue } from "./lib/dates";
import { STORAGE_KEYS } from "./lib/storage";
import { renderApp } from "./test/renderApp";

const tomorrow = toDateInputValue(addDays(new Date(), 1));

const savedDonations = () => JSON.parse(window.localStorage.getItem(STORAGE_KEYS.donations));

describe("signing in", () => {
  it("lets a visitor enter the demo", async () => {
    const { user } = renderApp({ signedIn: false });

    expect(
      screen.getByRole("heading", { name: "Share surplus food with people who need it" }),
    ).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Try the demo" }));

    expect(screen.getByRole("heading", { name: "Hi, Guest" })).toBeInTheDocument();
  });

  it("keeps the page the visitor opened", async () => {
    const { user } = renderApp({ route: "/ngos/roti-relay", signedIn: false });

    await user.click(screen.getByRole("button", { name: "Try the demo" }));

    expect(screen.getByRole("heading", { name: "Roti Relay" })).toBeInTheDocument();
  });
});

describe("home", () => {
  it("searches NGOs by name or area", async () => {
    const { user } = renderApp();
    const search = screen.getByRole("searchbox", { name: "Search NGOs" });

    await user.type(search, "aundh");
    expect(screen.getByRole("link", { name: /Kindred Kitchen/ })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Roti Relay/ })).not.toBeInTheDocument();

    await user.clear(search);
    await user.type(search, "zzz");
    expect(screen.getByText("No NGOs match your search.")).toBeInTheDocument();
  });
});

describe("donating", () => {
  it("walks through every step and shows the donation in Activity", async () => {
    const { user } = renderApp({ route: "/ngos/full-plate" });

    await user.click(screen.getByRole("button", { name: "Donate now" }));
    expect(screen.getByRole("heading", { name: "What are you donating?" })).toBeInTheDocument();
    expect(screen.getByText("Step 1 of 4 · For Full Plate Foundation")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /Cooked Food/ }));

    // Food details: a meal is required.
    await user.click(screen.getByRole("button", { name: "Continue" }));
    expect(screen.getByText("Pick at least one meal.")).toBeInTheDocument();

    await user.click(screen.getByRole("radio", { name: "Non-veg" }));
    await user.click(screen.getByRole("checkbox", { name: "Lunch" }));
    fireEvent.change(screen.getByRole("slider", { name: "How many people can it feed?" }), {
      target: { value: "25" },
    });
    fireEvent.change(screen.getByRole("slider", { name: "When was it cooked?" }), {
      target: { value: "8" },
    });
    expect(screen.getByText(/may be turned away/)).toBeInTheDocument();
    fireEvent.change(screen.getByRole("slider", { name: "When was it cooked?" }), {
      target: { value: "2" },
    });
    await user.click(screen.getByRole("button", { name: "Continue" }));

    // Pickup details: everything is validated before moving on.
    expect(screen.getByRole("heading", { name: "Pickup details" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Continue" }));
    expect(screen.getByText("Enter the full pickup address.")).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Pickup address" })).toHaveFocus();

    await user.type(screen.getByRole("textbox", { name: "Pickup address" }), "12 MG Road, Camp, Pune");
    await user.type(screen.getByRole("textbox", { name: "Phone number" }), "98765 43210");
    fireEvent.change(screen.getByLabelText("Date"), { target: { value: tomorrow } });
    fireEvent.change(screen.getByLabelText("Time"), { target: { value: "18:30" } });
    await user.click(screen.getByRole("checkbox", { name: "My food follows these guidelines." }));
    await user.click(screen.getByRole("button", { name: "Continue" }));

    // Delivery
    await user.click(screen.getByRole("radio", { name: /I'll drop it off/ }));
    await user.click(screen.getByRole("button", { name: "Post donation" }));

    expect(screen.getByRole("heading", { name: "Activity" })).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("Donation posted");
    const card = screen.getByRole("article", { name: "Full Plate Foundation" });
    expect(within(card).getByText("Drop-off scheduled")).toBeInTheDocument();
    expect(within(card).getByText("Cooked Food · Non-veg · Lunch")).toBeInTheDocument();
    expect(within(card).getByText("25 people · cooked 2 hours before posting")).toBeInTheDocument();

    expect(savedDonations()).toHaveLength(1);
    expect(savedDonations()[0]).toMatchObject({
      recipient: { id: "full-plate", name: "Full Plate Foundation" },
      phone: "98765 43210",
      date: tomorrow,
      deliveryMode: "Self Delivery",
    });
  });

  it("can send food to a hunger spot", async () => {
    const { user } = renderApp({ route: "/donate" });

    await user.click(screen.getByRole("button", { name: /Feed a hunger spot/ }));

    expect(screen.getByText("Step 1 of 4 · For Nearest hunger spot")).toBeInTheDocument();
  });

  it("sends the user back to the first unfinished step", () => {
    renderApp({
      route: "/donate/delivery",
      draft: { recipient: { type: "ngo", id: "roti-relay", name: "Roti Relay" }, category: "Raw Food" },
    });

    expect(screen.getByRole("heading", { name: "Raw Food" })).toBeInTheDocument();
    expect(screen.getByText("Step 2 of 4 · For Roti Relay")).toBeInTheDocument();
  });

  it("offers to resume a donation in progress", async () => {
    const { user } = renderApp({
      route: "/donate",
      draft: { recipient: { type: "ngo", id: "roti-relay", name: "Roti Relay" }, category: "Raw Food" },
    });

    expect(screen.getByText(/unfinished donation for/)).toHaveTextContent("Roti Relay");
    await user.click(screen.getByRole("link", { name: "Continue" }));

    expect(screen.getByRole("heading", { name: "Raw Food" })).toBeInTheDocument();
  });
});

describe("activity", () => {
  const donation = {
    id: "d1",
    createdAt: "2026-10-05T10:00:00.000Z",
    status: "Pickup requested",
    recipient: { type: "ngo", id: "roti-relay", name: "Roti Relay" },
    category: "Packed Food",
    foodType: "Veg",
    meals: ["Breakfast"],
    servings: 12,
    preparedHoursAgo: null,
    address: "4 FC Road, Pune",
    phone: "9876543210",
    date: tomorrow,
    time: "10:00",
    deliveryMode: "Pickup",
  };

  it("cancels a donation after confirmation", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(true);
    const { user } = renderApp({ route: "/activity", donations: [donation] });

    await user.click(screen.getByRole("button", { name: "Cancel donation" }));

    expect(screen.getByText("Cancelled")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Cancel donation" })).not.toBeInTheDocument();
    expect(savedDonations()[0].status).toBe("Cancelled");
  });

  it("shows an empty state", () => {
    renderApp({ route: "/activity" });

    expect(screen.getByRole("heading", { name: "No donations yet" })).toBeInTheDocument();
  });
});

describe("profile", () => {
  it("clears demo data and signs out", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(true);
    const { user } = renderApp({
      route: "/profile",
      donations: [
        { id: "a", status: "Pickup requested", servings: 10 },
        { id: "b", status: "Cancelled", servings: 5 },
      ],
    });

    const servings = screen.getByText("Servings shared").parentElement;
    expect(servings).toHaveTextContent("10");

    await user.click(screen.getByRole("button", { name: "Clear demo data" }));
    expect(savedDonations()).toEqual([]);

    await user.click(screen.getByRole("button", { name: "Sign out" }));
    expect(screen.getByRole("button", { name: "Try the demo" })).toBeInTheDocument();
  });
});

it("shows a not found page for unknown routes", () => {
  renderApp({ route: "/nope" });

  expect(screen.getByRole("heading", { name: "Page not found" })).toBeInTheDocument();
});
