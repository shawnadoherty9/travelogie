import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { toastMock, resetRegistrationMocks } from "@/test/registrationFormMocks";
import TourOperatorForm from "@/components/registration/TourOperatorForm";

const renderForm = () =>
  render(
    <MemoryRouter>
      <TourOperatorForm />
    </MemoryRouter>,
  );

describe("TourOperatorForm e2e validation", () => {
  beforeEach(() => {
    resetRegistrationMocks();
  });

  it("renders the create-profile heading", () => {
    renderForm();
    expect(
      screen.getByText(/Create Tour Operator Profile/i),
    ).toBeInTheDocument();
  });

  it("shows inline errors and a destructive toast when required fields and tours are missing", () => {
    renderForm();

    const submitBtn = screen.getByRole("button", {
      name: /Create Tour Operator Profile/i,
    });
    fireEvent.click(submitBtn);

    // Inline field errors from validateRequiredFields
    expect(screen.getByText(/First name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Last name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Birthdate is required/i)).toBeInTheDocument();
    // At least one tour offering required
    expect(
      screen.getByText(/Please add at least one tour offering/i),
    ).toBeInTheDocument();

    const destructiveCall = toastMock.mock.calls.find(
      ([arg]) => arg?.variant === "destructive",
    );
    expect(destructiveCall).toBeDefined();
    expect(String(destructiveCall![0].title)).toMatch(/Missing Information/i);
  });
});
