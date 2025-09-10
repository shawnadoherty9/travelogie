import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { DataImporter } from "@/components/admin/DataImporter";
import { Shield, Key, Lock, MapPin, Mic, Workflow, LogIn } from "lucide-react";

const Admin = () => {
  const [isAdminVerified, setIsAdminVerified] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [secrets, setSecrets] = useState({
    elevenLabs: "",
    n8n: "",
    mapbox: ""
  });
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, session, loading } = useAuth();

  useEffect(() => {
    const verifyAdminAccess = async () => {
      if (loading) return;
      
      if (!user || !session) {
        setVerifying(false);
        return;
      }

      try {
        const { data, error } = await supabase.functions.invoke('admin-auth', {
          body: { action: 'verify_admin' },
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        if (error) throw error;

        if (data.isAdmin) {
          setIsAdminVerified(true);
          loadSecrets();
        }
      } catch (error) {
        console.error('Admin verification error:', error);
        toast({
          title: "Access Denied",
          description: "You don't have admin privileges.",
          variant: "destructive",
        });
      } finally {
        setVerifying(false);
      }
    };

    verifyAdminAccess();
  }, [user, session, loading]);

  const handleSignIn = () => {
    navigate('/auth');
  };

  const loadSecrets = async () => {
    if (!session) return;
    
    try {
      const { data, error } = await supabase.functions.invoke('manage-secrets', {
        body: { action: 'get' },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;

      if (data.secrets) {
        setSecrets(data.secrets);
      }
    } catch (error) {
      console.error('Error loading secrets:', error);
      toast({
        title: "Error",
        description: "Failed to load secrets.",
        variant: "destructive",
      });
    }
  };

  const updateSecret = async (service: string, apiKey: string) => {
    if (!session) return;
    
    try {
      const { data, error } = await supabase.functions.invoke('manage-secrets', {
        body: { 
          action: 'update',
          secretName: service,
          secretValue: apiKey
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (error) throw error;
      
      toast({
        title: "Secret Updated",
        description: `${service} API key has been securely stored.`,
      });
      
      // Reload secrets to show updated masked values
      loadSecrets();
    } catch (error) {
      console.error('Error updating secret:', error);
      toast({
        title: "Error",
        description: `Failed to update ${service} secret.`,
        variant: "destructive",
      });
    }
  };

  const handleSecretUpdate = (service: keyof typeof secrets) => {
    updateSecret(service, secrets[service]);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAdminVerified(false);
    setSecrets({ elevenLabs: "", n8n: "", mapbox: "" });
    navigate("/");
  };

  if (loading || verifying) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex items-center justify-center p-8">
            <div className="text-center">
              <Shield className="w-8 h-8 mx-auto mb-4 text-primary animate-pulse" />
              <p>Verifying admin access...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user || !isAdminVerified) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Admin Access</CardTitle>
            <CardDescription>
              Enter admin credentials to manage API secrets
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-center text-muted-foreground">
                You need to sign in with an admin account to access this panel.
              </p>
              <Button onClick={handleSignIn} className="w-full">
                <LogIn className="w-4 h-4 mr-2" />
                Sign In to Continue
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Admin Panel</h1>
            <p className="text-muted-foreground">Manage API secrets and integrations</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>

        <Alert className="mb-6">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            All API keys are encrypted and stored securely in Supabase. Never share these credentials.
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="elevenlabs" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="elevenlabs">
              <Mic className="w-4 h-4 mr-2" />
              Eleven Labs
            </TabsTrigger>
            <TabsTrigger value="n8n">
              <Workflow className="w-4 h-4 mr-2" />
              N8N
            </TabsTrigger>
            <TabsTrigger value="mapbox">
              <MapPin className="w-4 h-4 mr-2" />
              MapBox
            </TabsTrigger>
            <TabsTrigger value="import">
              <Key className="w-4 h-4 mr-2" />
              Data Import
            </TabsTrigger>
          </TabsList>

          <TabsContent value="elevenlabs">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Mic className="w-5 h-5 mr-2 text-primary" />
                  Eleven Labs API Configuration
                </CardTitle>
                <CardDescription>
                  Configure voice AI capabilities for cultural experiences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="elevenlabs-key">API Key</Label>
                  <Input
                    id="elevenlabs-key"
                    type="password"
                    placeholder="sk-..."
                    value={secrets.elevenLabs}
                    onChange={(e) => setSecrets(prev => ({ ...prev, elevenLabs: e.target.value }))}
                  />
                  <p className="text-sm text-muted-foreground">
                    Get your API key from{" "}
                    <a href="https://elevenlabs.io/docs/api-reference/getting-started" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      Eleven Labs Dashboard
                    </a>
                  </p>
                </div>
                <Button onClick={() => handleSecretUpdate('elevenLabs')} className="w-full">
                  <Key className="w-4 h-4 mr-2" />
                  Update Eleven Labs Secret
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="n8n">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Workflow className="w-5 h-5 mr-2 text-primary" />
                  N8N Automation Configuration
                </CardTitle>
                <CardDescription>
                  Configure workflow automation for booking and notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="n8n-key">API Key / Webhook URL</Label>
                  <Input
                    id="n8n-key"
                    type="password"
                    placeholder="n8n_api_key or webhook URL"
                    value={secrets.n8n}
                    onChange={(e) => setSecrets(prev => ({ ...prev, n8n: e.target.value }))}
                  />
                  <p className="text-sm text-muted-foreground">
                    Configure your N8N instance webhook URL or API key for automation workflows
                  </p>
                </div>
                <Button onClick={() => handleSecretUpdate('n8n')} className="w-full">
                  <Key className="w-4 h-4 mr-2" />
                  Update N8N Secret
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mapbox">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-primary" />
                  MapBox Configuration
                </CardTitle>
                <CardDescription>
                  Configure mapping and geolocation services for travel experiences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="mapbox-key">Public Access Token</Label>
                  <Input
                    id="mapbox-key"
                    type="password"
                    placeholder="pk...."
                    value={secrets.mapbox}
                    onChange={(e) => setSecrets(prev => ({ ...prev, mapbox: e.target.value }))}
                  />
                  <p className="text-sm text-muted-foreground">
                    Get your public access token from{" "}
                    <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                      MapBox Dashboard
                    </a>
                  </p>
                </div>
                <Button onClick={() => handleSecretUpdate('mapbox')} className="w-full">
                  <Key className="w-4 h-4 mr-2" />
                  Update MapBox Secret
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="import">
            <DataImporter />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;