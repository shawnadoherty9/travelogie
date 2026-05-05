import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  LiveKitRoom,
  VideoConference,
  RoomAudioRenderer,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, AlertTriangle } from "lucide-react";

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

  useEffect(() => {
    let cancelled = false;
    async function fetchToken() {
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
      if (cancelled) return;
      if (invokeErr || !res?.token) {
        setError(
          (invokeErr as { message?: string } | null)?.message ||
            (res as { error?: string } | null)?.error ||
            "Unable to join session",
        );
        return;
      }
      setData(res as TokenResponse);
    }
    fetchToken();
    return () => {
      cancelled = true;
    };
  }, [type, bookingId]);

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
        token={data.token}
        serverUrl={data.url}
        connect
        video
        audio
        onDisconnected={() => navigate("/dashboard")}
        style={{ height: "100vh" }}
      >
        <VideoConference />
        <RoomAudioRenderer />
      </LiveKitRoom>
    </div>
  );
}
