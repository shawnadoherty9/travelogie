import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { toastMock, resetRegistrationMocks } from "@/test/registrationFormMocks";
import TravelerForm from "@/components/registration/TravelerForm";

const renderForm = () =>
  render(
    <MemoryRouter>
      <TravelerForm />
    </MemoryRouter>,
  );

describe("TravelerForm e2e validation", () => {
  beforeEach(() => {
    resetRegistrationMocks();
  });

  it("renders the create-profile heading", () => {
    renderForm();
    expect(
      screen.getByText(/Create Your Traveler Profile/i),
    ).toBeInTheDocument();
  });

  it("blocks submission and shows a destructive validation toast when required fields are empty", () => {
    renderForm();

    // Required inputs use native HTML5 `required` so calling form.requestSubmit()
    // would be intercepted before our handler runs. Disable the constraint to
    // simulate a user bypassing native validation (e.g. via devtools / older
    // browsers) and verify our zod-based handler still rejects the submission.
    const submitBtn = screen.getByRole("button", {
      name: /Create Traveler Profile/i,
    });
    const form = submitBtn.closest("form");
    expect(form).not.toBeNull();
    form!
      .querySelectorAll<HTMLInputElement>("input[required]")
      .forEach((el) => (el.required = false));

    fireEvent.click(submitBtn);

    expect(toastMock).toHaveBeenCalled();
    const destructiveCall = toastMock.mock.calls.find(
      ([arg]) => arg?.variant === "destructive",
    );
    expect(destructiveCall).toBeDefined();
    expect(String(destructiveCall![0].description)).toMatch(
      /first name|required|input/i,
    );
  });
});
