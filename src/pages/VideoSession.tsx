import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  LiveKitRoom,
  VideoConference,
  RoomAudioRenderer,
} from "@livekit/components-react";
import { DisconnectReason } from "livekit-client";
import "@livekit/components-styles";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface TokenResponse {
  token: string;
  url: string;
  room: string;
  role: "customer" | "provider";
  displayName: string;
}

export default function VideoSession() {
  const { type, bookingId } = useParams<{ type: string; bookingId: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<TokenResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expired, setExpired] = useState(false);
  // Tracks how many times we've auto-refreshed after a token-expired
  // disconnect. We only retry once silently; further failures show the
  // fallback UI so the user can decide what to do.
  const refreshAttemptsRef = useRef(0);

  const fetchToken = useCallback(async () => {
    setError(null);
    if (type !== "language" && type !== "cultural") {
      setError("Invalid session type");
      return;
    }
    if (!bookingId) {
      setError("Missing booking id");
      return;
    }
    const { data: res, error: invokeErr } = await supabase.functions.invoke(
      "livekit-token",
      { body: { bookingType: type, bookingId } },
    );
    if (invokeErr || !res?.token) {
      setError(
        (invokeErr as { message?: string } | null)?.message ||
          (res as { error?: string } | null)?.error ||
          "Unable to join session",
      );
      setData(null);
      return;
    }
    setData(res as TokenResponse);
  }, [type, bookingId]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await fetchToken();
      if (cancelled) setData(null);
    })();
    return () => {
      cancelled = true;
    };
  }, [fetchToken]);

  const handleDisconnected = useCallback(
    async (reason?: DisconnectReason) => {
      const tokenProblem =
        reason === DisconnectReason.TOKEN_EXPIRED ||
        // Server may also surface auth issues with these reasons after expiry
        reason === DisconnectReason.SIGNAL_CLOSE ||
        reason === DisconnectReason.JOIN_FAILURE;

      if (tokenProblem && refreshAttemptsRef.current < 1) {
        refreshAttemptsRef.current += 1;
        toast.message("Reconnecting…", {
          description: "Your session token expired. Refreshing now.",
        });
        // Tear down current room first so LiveKitRoom remounts with new token
        setData(null);
        await fetchToken();
        return;
      }

      if (tokenProblem) {
        // Already retried once — show fallback instead of looping.
        setExpired(true);
        setData(null);
        return;
      }

      // Normal user-initiated disconnect
      navigate("/dashboard");
    },
    [fetchToken, navigate],
  );

  const handleRetryManually = async () => {
    refreshAttemptsRef.current = 0;
    setExpired(false);
    await fetchToken();
  };

  if (expired) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <Card className="max-w-md w-full p-6 text-center space-y-4">
          <AlertTriangle className="w-10 h-10 mx-auto text-destructive" />
          <h1 className="text-xl font-semibold">Session disconnected</h1>
          <p className="text-sm text-muted-foreground">
            Your access to this room expired and we couldn't automatically
            reconnect you. You can try again or head back to your dashboard.
          </p>
          <div className="flex gap-2 justify-center">
            <Button
              onClick={handleRetryManually}
              className="bg-sky-600 hover:bg-sky-500"
            >
              Rejoin session
            </Button>
            <Button variant="outline" onClick={() => navigate("/dashboard")}>
              Back to dashboard
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-background">
        <Card className="max-w-md w-full p-6 text-center space-y-4">
          <AlertTriangle className="w-10 h-10 mx-auto text-destructive" />
          <h1 className="text-xl font-semibold">Cannot join session</h1>
          <p className="text-sm text-muted-foreground">{error}</p>
          <Button onClick={() => navigate("/dashboard")} className="bg-sky-600 hover:bg-sky-500">
            Back to dashboard
          </Button>
        </Card>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin" />
          Connecting to session…
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-background" data-lk-theme="default">
      <LiveKitRoom
        // key forces a clean remount whenever we mint a new token
        key={data.token}
        token={data.token}
        serverUrl={data.url}
        connect
        video
        audio
        onDisconnected={handleDisconnected}
        style={{ height: "100vh" }}
      >
        <VideoConference />
        <RoomAudioRenderer />
      </LiveKitRoom>
    </div>
  );
}
