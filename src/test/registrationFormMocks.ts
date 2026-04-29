/**
 * Shared mocks for registration form e2e tests.
 *
 * Each form test imports `toastMock` and `navigateMock` to assert side effects.
 * We mock external boundaries (toast, auth, supabase client, router) so the
 * tests focus on validation behavior of the form components themselves.
 */
import { vi } from "vitest";

export const toastMock = vi.fn();
export const navigateMock = vi.fn();

vi.mock("@/hooks/use-toast", () => ({
  useToast: () => ({ toast: toastMock, dismiss: vi.fn(), toasts: [] }),
  toast: toastMock,
}));

vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({
    user: { id: "test-user-id", email: "test@example.com" },
    session: { access_token: "test-token" },
    loading: false,
    signOut: vi.fn(),
  }),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>(
    "react-router-dom",
  );
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

// Defensive supabase mock — forms shouldn't reach DB calls when validation fails,
// but we stub it so an accidental call doesn't blow up the test runtime.
vi.mock("@/integrations/supabase/client", () => {
  const builder = {
    update: vi.fn().mockReturnThis(),
    insert: vi.fn().mockReturnThis(),
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockResolvedValue({ data: null, error: null }),
    then: undefined,
  };
  return {
    supabase: {
      from: vi.fn(() => builder),
      auth: {
        getUser: vi
          .fn()
          .mockResolvedValue({ data: { user: { id: "test-user-id" } }, error: null }),
        getSession: vi
          .fn()
          .mockResolvedValue({ data: { session: null }, error: null }),
      },
    },
  };
});

export function resetRegistrationMocks(): void {
  toastMock.mockClear();
  navigateMock.mockClear();
}
