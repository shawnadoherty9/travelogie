import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import UserTypeSelection from "@/components/registration/UserTypeSelection";
import TravelerRegistration from "@/components/registration/TravelerRegistration";
import Header from "@/components/layout/Header";

const Registration = () => {
  const [selectedUserType, setSelectedUserType] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleUserTypeSelection = (type: string) => {
    setSelectedUserType(type);
  };

  const handleRegistrationComplete = async (registrationData: any) => {
    if (!user) {
      toast.error("You must be logged in to complete registration");
      return;
    }

    try {
      // Update profile with all the registration data
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          user_type: registrationData.userType,
          first_name: registrationData.firstName,
          last_name: registrationData.lastName,
          birthdate: registrationData.birthdate,
          home_city: registrationData.homeCity,
          bio: registrationData.bio,
          upcoming_travel: registrationData.upcomingTravel,
          interests: registrationData.interests,
          custom_interests: registrationData.customInterests ? registrationData.customInterests.split(',').map((s: string) => s.trim()) : [],
          social_media_links: registrationData.socialMedia
        })
        .eq('user_id', user.id);

      if (profileError) throw profileError;

      // Insert languages
      if (registrationData.languages && registrationData.languages.length > 0) {
        const languageInserts = registrationData.languages.map((lang: any) => ({
          user_id: user.id,
          language_code: lang.code,
          language_name: lang.name,
          fluency_level: lang.fluency,
          is_primary: lang.isPrimary
        }));

        const { error: languageError } = await supabase
          .from('user_languages')
          .insert(languageInserts);

        if (languageError) throw languageError;
      }

      toast.success("Registration completed successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.error('Registration error:', error);
      toast.error("Failed to complete registration. Please try again.");
    }
  };

  const handleBack = () => {
    setSelectedUserType(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-primary/5">
      <Header />
      
      <main className="pt-20">
        {!selectedUserType ? (
          <UserTypeSelection onSelectType={handleUserTypeSelection} />
        ) : selectedUserType === 'traveler' ? (
          <TravelerRegistration 
            onComplete={handleRegistrationComplete}
            onBack={handleBack}
          />
        ) : (
          <div className="max-w-4xl mx-auto p-6 text-center">
            <h2 className="text-2xl font-bold mb-4">
              {selectedUserType.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} Registration
            </h2>
            <p className="text-muted-foreground mb-6">
              Registration form for {selectedUserType} is coming soon!
            </p>
            <button 
              onClick={handleBack}
              className="text-primary hover:underline"
            >
              ← Back to User Types
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Registration;