import { fireEvent, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { addDays, toDateInputValue, toTimeInputValue } from "./lib/dates";
import { STORAGE_KEYS } from "./lib/storage";
import { mockGeolocation, renderApp } from "./test/renderApp";

const tomorrow = toDateInputValue(addDays(new Date(), 1));
const inHours = (hours) => new Date(Date.now() + hours * 60 * 60 * 1000);

const savedDonations = () => JSON.parse(window.localStorage.getItem(STORAGE_KEYS.donations));

describe("landing", () => {
  it("opens straight on Home as a guest, with a welcome that can be dismissed", async () => {
    const { user } = renderApp();
    const welcome = { name: "Share surplus food with people who need it" };

    expect(screen.getByRole("heading", { name: "Hi, Guest" })).toBeInTheDocument();
    expect(screen.getByRole("heading", welcome)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Try the demo" })).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Dismiss welcome" }));

    expect(screen.queryByRole("heading", welcome)).not.toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Have extra food?" })).toBeInTheDocument();
    expect(window.localStorage.getItem(STORAGE_KEYS.welcomeDismissed)).toBe("true");
  });

  it("opens shared links directly", () => {
    renderApp({ route: "/ngos/roti-relay" });

    expect(screen.getByRole("heading", { level: 1, name: "Roti Relay" })).toBeInTheDocument();
  });
});

describe("finding NGOs nearby", () => {
  it("sorts NGOs by distance once the visitor shares their location", async () => {
    mockGeolocation({ lat: 18.559, lng: 73.808 }); // Aundh, next to Kindred Kitchen
    const { user } = renderApp({ route: "/ngos" });

    await user.click(screen.getByRole("button", { name: "Sort by distance" }));

    expect(screen.getByText("Sorted by distance from you")).toBeInTheDocument();
    const names = screen.getAllByRole("heading", { level: 2 }).map((heading) => heading.textContent);
    expect(names[0]).toBe("Kindred Kitchen");
    expect(screen.getAllByText(/away$/)[0]).toHaveTextContent("50 m away");
  });

  it("says plainly when the demo NGOs are far away", async () => {
    mockGeolocation({ lat: 28.6139, lng: 77.209 }); // Delhi
    const { user } = renderApp({ welcomeDismissed: true });

    await user.click(screen.getByRole("button", { name: "Sort by distance" }));

    expect(screen.getByRole("heading", { name: "NGOs near you" })).toBeInTheDocument();
    expect(screen.getByText(/These demo NGOs are in Pune, [\d,]+ km from you/)).toBeInTheDocument();
  });

  it("explains when location is blocked", async () => {
    mockGeolocation({ code: 1 });
    const { user } = renderApp({ route: "/ngos" });

    await user.click(screen.getByRole("button", { name: "Sort by distance" }));

    expect(screen.getByText(/Location is blocked/)).toBeInTheDocument();
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
    await user.click(screen.getByRole("checkbox", { name: "My food follows these guidelines." }));

    // Cooked two hours ago, so a pickup days from now is refused.
    expect(screen.getByText(/Cooked food has to be collected while it's fresh/)).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Date"), { target: { value: toDateInputValue(addDays(new Date(), 3)) } });
    fireEvent.change(screen.getByLabelText("Time"), { target: { value: "10:00" } });
    await user.click(screen.getByRole("button", { name: "Continue" }));
    expect(screen.getByText(/^Cooked food has to be picked up by/)).toBeInTheDocument();

    const pickup = inHours(2);
    fireEvent.change(screen.getByLabelText("Date"), { target: { value: toDateInputValue(pickup) } });
    fireEvent.change(screen.getByLabelText("Time"), { target: { value: toTimeInputValue(pickup) } });
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
      date: toDateInputValue(inHours(2)),
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
  it("clears demo data, and has no sign-out in demo mode", async () => {
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
    expect(screen.queryByRole("button", { name: "Sign out" })).not.toBeInTheDocument();
  });
});

it("shows a not found page for unknown routes", () => {
  renderApp({ route: "/nope" });

  expect(screen.getByRole("heading", { name: "Page not found" })).toBeInTheDocument();
});
