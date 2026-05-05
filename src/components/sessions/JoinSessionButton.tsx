import { Button } from "@/components/ui/button";
import { Video } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface JoinSessionButtonProps {
  bookingId: string;
  bookingType: "language" | "cultural";
  disabled?: boolean;
  size?: "sm" | "default" | "lg";
  label?: string;
}

/**
 * Navigates the participant to the live video room for a booking.
 * Authorization is enforced server-side by the livekit-token edge function:
 * only the booking's customer or provider can obtain a token.
 */
export function JoinSessionButton({
  bookingId,
  bookingType,
  disabled,
  size = "sm",
  label = "Join session",
}: JoinSessionButtonProps) {
  const navigate = useNavigate();
  return (
    <Button
      size={size}
      disabled={disabled}
      onClick={() => navigate(`/session/${bookingType}/${bookingId}`)}
      className="bg-sky-600 hover:bg-sky-500 text-white"
    >
      <Video className="w-4 h-4 mr-2" />
      {label}
    </Button>
  );
}
