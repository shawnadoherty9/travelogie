import React, { useState } from 'react';
import UserTypeSelection from './UserTypeSelection';
import TravelerForm from './TravelerForm';
import TourOperatorForm from './TourOperatorForm';
import LanguageTeacherForm from './LanguageTeacherForm';
import CulturalExperienceForm from './CulturalExperienceForm';
import EventVenueForm from './EventVenueForm';

type UserType = 'traveler' | 'tour_operator' | 'language_teacher' | 'cultural_experience' | 'event_venue';

const RegistrationFlow: React.FC = () => {
  const [selectedType, setSelectedType] = useState<UserType | null>(null);

  const renderForm = () => {
    switch (selectedType) {
      case 'traveler':
        return <TravelerForm />;
      case 'tour_operator':
        return <TourOperatorForm />;
      case 'language_teacher':
        return <LanguageTeacherForm />;
      case 'cultural_experience':
        return <CulturalExperienceForm />;
      case 'event_venue':
        return <EventVenueForm />;
      default:
        return <UserTypeSelection onSelectType={setSelectedType} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {selectedType && (
        <div className="container mx-auto px-4 py-4">
          <button
            onClick={() => setSelectedType(null)}
            className="text-primary hover:underline mb-4"
          >
            ← Back to profile types
          </button>
        </div>
      )}
      {renderForm()}
    </div>
  );
};

export default RegistrationFlow;