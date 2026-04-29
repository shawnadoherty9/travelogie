import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { toastMock, resetRegistrationMocks } from "@/test/registrationFormMocks";
import CulturalExperienceForm from "@/components/registration/CulturalExperienceForm";

const renderForm = () =>
  render(
    <MemoryRouter>
      <CulturalExperienceForm />
    </MemoryRouter>,
  );

describe("CulturalExperienceForm e2e validation", () => {
  beforeEach(() => {
    resetRegistrationMocks();
  });

  it("renders the create-profile heading", () => {
    renderForm();
    expect(
      screen.getByText(/Create Cultural Experience Host Profile/i),
    ).toBeInTheDocument();
  });

  it("shows inline errors and a destructive toast when required fields and experiences are missing", () => {
    renderForm();

    fireEvent.click(
      screen.getByRole("button", {
        name: /Create Cultural Experience Host Profile/i,
      }),
    );

    expect(screen.getByText(/First name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Last name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Birthdate is required/i)).toBeInTheDocument();
    // At least one experience required (label uses "experience")
    expect(
      screen.getByText(/Please add at least one experience/i),
    ).toBeInTheDocument();

    const destructiveCall = toastMock.mock.calls.find(
      ([arg]) => arg?.variant === "destructive",
    );
    expect(destructiveCall).toBeDefined();
    expect(String(destructiveCall![0].title)).toMatch(/Missing Information/i);
  });
});
