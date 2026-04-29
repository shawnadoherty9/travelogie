import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { toastMock, resetRegistrationMocks } from "@/test/registrationFormMocks";
import LanguageTeacherForm from "@/components/registration/LanguageTeacherForm";

const renderForm = () =>
  render(
    <MemoryRouter>
      <LanguageTeacherForm />
    </MemoryRouter>,
  );

describe("LanguageTeacherForm e2e validation", () => {
  beforeEach(() => {
    resetRegistrationMocks();
  });

  it("renders the create-profile heading", () => {
    renderForm();
    expect(
      screen.getByText(/Create Language Teacher Profile/i),
    ).toBeInTheDocument();
  });

  it("shows inline errors and a destructive toast when required fields and offerings are missing", () => {
    renderForm();

    fireEvent.click(
      screen.getByRole("button", { name: /Create Language Teacher Profile/i }),
    );

    expect(screen.getByText(/First name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Last name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Birthdate is required/i)).toBeInTheDocument();
    // Language offering required
    expect(
      screen.getByText(/Please add at least one language offering/i),
    ).toBeInTheDocument();

    const destructiveCall = toastMock.mock.calls.find(
      ([arg]) => arg?.variant === "destructive",
    );
    expect(destructiveCall).toBeDefined();
    expect(String(destructiveCall![0].title)).toMatch(/Missing Information/i);
  });
});
