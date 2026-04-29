import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { toastMock, resetRegistrationMocks } from "@/test/registrationFormMocks";
import EventVenueForm from "@/components/registration/EventVenueForm";

const renderForm = () =>
  render(
    <MemoryRouter>
      <EventVenueForm />
    </MemoryRouter>,
  );

describe("EventVenueForm e2e validation", () => {
  beforeEach(() => {
    resetRegistrationMocks();
  });

  it("renders the create-profile heading", () => {
    renderForm();
    expect(
      screen.getByText(/Create Event Venue Profile/i),
    ).toBeInTheDocument();
  });

  it("shows inline errors and a destructive toast when required fields and venue spaces are missing", () => {
    renderForm();

    fireEvent.click(
      screen.getByRole("button", { name: /Create Event Venue Profile/i }),
    );

    expect(screen.getByText(/First name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Last name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Birthdate is required/i)).toBeInTheDocument();
    // Venue-specific required fields
    expect(screen.getByText(/Venue name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Venue address is required/i)).toBeInTheDocument();
    // At least one venue space required
    expect(
      screen.getByText(/Please add at least one venue space/i),
    ).toBeInTheDocument();

    const destructiveCall = toastMock.mock.calls.find(
      ([arg]) => arg?.variant === "destructive",
    );
    expect(destructiveCall).toBeDefined();
    expect(String(destructiveCall![0].title)).toMatch(/Missing Information/i);
  });
});
