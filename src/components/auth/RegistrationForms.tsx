import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Upload, MapPin, Calendar, Languages, Users, Building, Camera } from 'lucide-react';

interface RegistrationFormProps {
  userType: string;
  formData: any;
  onFormChange: (data: any) => void;
}

export const TravelerRegistrationForm = ({ formData, onFormChange }: { formData: any; onFormChange: (data: any) => void }) => {
  const [selectedInterests, setSelectedInterests] = useState<string[]>(formData.interests || []);
  const [customInterests, setCustomInterests] = useState<string[]>(formData.customInterests || []);
  const [newCustomInterest, setNewCustomInterest] = useState('');
  const [languages, setLanguages] = useState(formData.languages || [{ code: '', name: '', fluency: 'beginner', isPrimary: false }]);

  const predefinedInterests = [
    'Music', 'Art', 'Theater', 'Film', 'Tech', 'Founder', 'Sports', 
    'Nature', 'Family', 'Expat', 'Photography', 'Cooking', 'History', 'Architecture'
  ];

  const socialPlatforms = [
    'TikTok', 'Instagram', 'Facebook', 'WeChat', 'Douyin', 'X', 'WhatsApp', 'Telegram', 'Line'
  ];

  const handleInterestToggle = (interest: string) => {
    const newInterests = selectedInterests.includes(interest)
      ? selectedInterests.filter(i => i !== interest)
      : [...selectedInterests, interest];
    setSelectedInterests(newInterests);
    onFormChange({ ...formData, interests: newInterests });
  };

  const addCustomInterest = () => {
    if (newCustomInterest.trim() && !customInterests.includes(newCustomInterest.trim())) {
      const newCustoms = [...customInterests, newCustomInterest.trim()];
      setCustomInterests(newCustoms);
      onFormChange({ ...formData, customInterests: newCustoms });
      setNewCustomInterest('');
    }
  };

  const removeCustomInterest = (interest: string) => {
    const newCustoms = customInterests.filter(i => i !== interest);
    setCustomInterests(newCustoms);
    onFormChange({ ...formData, customInterests: newCustoms });
  };

  const updateLanguage = (index: number, field: string, value: any) => {
    const newLanguages = [...languages];
    newLanguages[index] = { ...newLanguages[index], [field]: value };
    setLanguages(newLanguages);
    onFormChange({ ...formData, languages: newLanguages });
  };

  const addLanguage = () => {
    const newLanguages = [...languages, { code: '', name: '', fluency: 'beginner', isPrimary: false }];
    setLanguages(newLanguages);
    onFormChange({ ...formData, languages: newLanguages });
  };

  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Users className="w-5 h-5" />
          Personal Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="birthdate">Date of Birth</Label>
            <Input
              id="birthdate"
              type="date"
              value={formData.birthdate || ''}
              onChange={(e) => onFormChange({ ...formData, birthdate: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="homeCity">Home City</Label>
            <Input
              id="homeCity"
              placeholder="e.g., New York, USA"
              value={formData.homeCity || ''}
              onChange={(e) => onFormChange({ ...formData, homeCity: e.target.value })}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="upcomingTravel">Upcoming Travel Plans</Label>
          <Textarea
            id="upcomingTravel"
            placeholder="Tell us about your travel plans..."
            value={formData.upcomingTravel || ''}
            onChange={(e) => onFormChange({ ...formData, upcomingTravel: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="travelDreamList">Travel Dream List</Label>
          <Textarea
            id="travelDreamList"
            placeholder="Places you dream of visiting..."
            value={formData.travelDreamList || ''}
            onChange={(e) => onFormChange({ ...formData, travelDreamList: e.target.value })}
          />
        </div>
      </div>

      {/* Languages */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Languages className="w-5 h-5" />
          Languages Spoken
        </h3>
        
        {languages.map((lang, index) => (
          <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-2 p-4 border rounded-lg">
            <Input
              placeholder="Language name"
              value={lang.name}
              onChange={(e) => updateLanguage(index, 'name', e.target.value)}
            />
            <Select value={lang.fluency} onValueChange={(value) => updateLanguage(index, 'fluency', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
                <SelectItem value="native">Native</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={lang.isPrimary}
                onCheckedChange={(checked) => updateLanguage(index, 'isPrimary', checked)}
              />
              <Label className="text-sm">Primary</Label>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => {
                const newLanguages = languages.filter((_, i) => i !== index);
                setLanguages(newLanguages);
                onFormChange({ ...formData, languages: newLanguages });
              }}
            >
              Remove
            </Button>
          </div>
        ))}
        <Button variant="outline" onClick={addLanguage}>
          <Plus className="w-4 h-4 mr-2" />
          Add Language
        </Button>
      </div>

      {/* Interests */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Interests</h3>
        
        <div className="flex flex-wrap gap-2">
          {predefinedInterests.map((interest) => (
            <Badge
              key={interest}
              variant={selectedInterests.includes(interest) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => handleInterestToggle(interest)}
            >
              {interest}
            </Badge>
          ))}
        </div>

        <div className="space-y-2">
          <Label>Custom Interests</Label>
          <div className="flex gap-2">
            <Input
              placeholder="Add your own interest..."
              value={newCustomInterest}
              onChange={(e) => setNewCustomInterest(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addCustomInterest()}
            />
            <Button onClick={addCustomInterest} size="sm">Add</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {customInterests.map((interest) => (
              <Badge key={interest} variant="secondary" className="cursor-pointer">
                {interest}
                <X className="w-3 h-3 ml-1" onClick={() => removeCustomInterest(interest)} />
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Social Media */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Social Media (Optional)</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {socialPlatforms.map((platform) => (
            <div key={platform}>
              <Label htmlFor={platform.toLowerCase()}>{platform}</Label>
              <Input
                id={platform.toLowerCase()}
                placeholder={`Your ${platform} handle`}
                value={formData.socialMediaLinks?.[platform.toLowerCase()] || ''}
                onChange={(e) => onFormChange({
                  ...formData,
                  socialMediaLinks: {
                    ...formData.socialMediaLinks,
                    [platform.toLowerCase()]: e.target.value
                  }
                })}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Profile Photo Upload */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Camera className="w-5 h-5" />
          Profile Photo
        </h3>
        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
          <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
          <p className="text-xs text-muted-foreground">PNG, JPG up to 10MB</p>
        </div>
      </div>
    </div>
  );
};

export const TourOperatorRegistrationForm = ({ formData, onFormChange }: { formData: any; onFormChange: (data: any) => void }) => {
  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          Tour Operator Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="birthdate">Date of Birth</Label>
            <Input
              id="birthdate"
              type="date"
              value={formData.birthdate || ''}
              onChange={(e) => onFormChange({ ...formData, birthdate: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="homeCity">Home City</Label>
            <Input
              id="homeCity"
              placeholder="e.g., Barcelona, Spain"
              value={formData.homeCity || ''}
              onChange={(e) => onFormChange({ ...formData, homeCity: e.target.value })}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="geographicAvailability">Geographic Area of Availability</Label>
          <Textarea
            id="geographicAvailability"
            placeholder="Describe the areas where you offer tours..."
            value={formData.geographicAvailability || ''}
            onChange={(e) => onFormChange({ ...formData, geographicAvailability: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="bio">About Your Tours</Label>
          <Textarea
            id="bio"
            placeholder="Tell us about your tour offerings and experience..."
            value={formData.bio || ''}
            onChange={(e) => onFormChange({ ...formData, bio: e.target.value })}
          />
        </div>
      </div>

      {/* Tour Specialties */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Tour Specialties</h3>
        
        <div className="space-y-2">
          <Label>Tour Types</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {['Historical Tours', 'Food Tours', 'Art Tours', 'Nature Tours', 'Architecture Tours', 'Photography Tours', 'Night Tours', 'Walking Tours', 'Bike Tours', 'Custom Tours'].map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox
                  id={type}
                  checked={formData.tourTypes?.includes(type) || false}
                  onCheckedChange={(checked) => {
                    const current = formData.tourTypes || [];
                    const updated = checked 
                      ? [...current, type]
                      : current.filter((t: string) => t !== type);
                    onFormChange({ ...formData, tourTypes: updated });
                  }}
                />
                <Label htmlFor={type} className="text-sm">{type}</Label>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Profile Photo Upload */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Camera className="w-5 h-5" />
          Profile Photo
        </h3>
        <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
          <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Click to upload or drag and drop</p>
          <p className="text-xs text-muted-foreground">PNG, JPG up to 10MB</p>
        </div>
      </div>
    </div>
  );
};

export const LanguageTeacherRegistrationForm = ({ formData, onFormChange }: { formData: any; onFormChange: (data: any) => void }) => {
  const [teachingLanguages, setTeachingLanguages] = useState(formData.teachingLanguages || [{ name: '', levels: [] }]);

  const skillLevels = ['Beginner', 'Intermediate', 'Advanced'];

  const updateTeachingLanguage = (index: number, field: string, value: any) => {
    const newLanguages = [...teachingLanguages];
    newLanguages[index] = { ...newLanguages[index], [field]: value };
    setTeachingLanguages(newLanguages);
    onFormChange({ ...formData, teachingLanguages: newLanguages });
  };

  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Languages className="w-5 h-5" />
          Language Teacher Information
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="birthdate">Date of Birth</Label>
            <Input
              id="birthdate"
              type="date"
              value={formData.birthdate || ''}
              onChange={(e) => onFormChange({ ...formData, birthdate: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="homeCity">Home City</Label>
            <Input
              id="homeCity"
              placeholder="e.g., Tokyo, Japan"
              value={formData.homeCity || ''}
              onChange={(e) => onFormChange({ ...formData, homeCity: e.target.value })}
            />
          </div>
        </div>
      </div>

      {/* Teaching Languages */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Languages You Teach</h3>
        
        {teachingLanguages.map((lang, index) => (
          <div key={index} className="p-4 border rounded-lg space-y-3">
            <Input
              placeholder="Language name (e.g., English, Spanish)"
              value={lang.name}
              onChange={(e) => updateTeachingLanguage(index, 'name', e.target.value)}
            />
            
            <div>
              <Label className="text-sm">Student Levels You Teach</Label>
              <div className="flex gap-2 mt-2">
                {skillLevels.map((level) => (
                  <div key={level} className="flex items-center space-x-2">
                    <Checkbox
                      checked={lang.levels?.includes(level) || false}
                      onCheckedChange={(checked) => {
                        const current = lang.levels || [];
                        const updated = checked 
                          ? [...current, level]
                          : current.filter((l: string) => l !== level);
                        updateTeachingLanguage(index, 'levels', updated);
                      }}
                    />
                    <Label className="text-sm">{level}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
        
        <Button variant="outline" onClick={() => {
          const newLanguages = [...teachingLanguages, { name: '', levels: [] }];
          setTeachingLanguages(newLanguages);
          onFormChange({ ...formData, teachingLanguages: newLanguages });
        }}>
          <Plus className="w-4 h-4 mr-2" />
          Add Teaching Language
        </Button>
      </div>

      {/* Teaching Experience */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Teaching Experience</h3>
        
        <div>
          <Label htmlFor="teachingExperience">Years of Experience</Label>
          <Select
            value={formData.teachingExperience || ''}
            onValueChange={(value) => onFormChange({ ...formData, teachingExperience: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select experience level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="beginner">Less than 1 year</SelectItem>
              <SelectItem value="intermediate">1-3 years</SelectItem>
              <SelectItem value="experienced">3-5 years</SelectItem>
              <SelectItem value="expert">5+ years</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="teachingMethods">Teaching Methods & Approach</Label>
          <Textarea
            id="teachingMethods"
            placeholder="Describe your teaching style and methods..."
            value={formData.teachingMethods || ''}
            onChange={(e) => onFormChange({ ...formData, teachingMethods: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
};

export const CulturalExperienceRegistrationForm = ({ formData, onFormChange }: { formData: any; onFormChange: (data: any) => void }) => {
  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Users className="w-5 h-5" />
          Cultural Experience Provider
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="birthdate">Date of Birth</Label>
            <Input
              id="birthdate"
              type="date"
              value={formData.birthdate || ''}
              onChange={(e) => onFormChange({ ...formData, birthdate: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="homeCity">Home City</Label>
            <Input
              id="homeCity"
              placeholder="e.g., Mumbai, India"
              value={formData.homeCity || ''}
              onChange={(e) => onFormChange({ ...formData, homeCity: e.target.value })}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="culturalBackground">Cultural Background</Label>
          <Textarea
            id="culturalBackground"
            placeholder="Tell us about your cultural heritage and background..."
            value={formData.culturalBackground || ''}
            onChange={(e) => onFormChange({ ...formData, culturalBackground: e.target.value })}
          />
        </div>
      </div>

      {/* Experience Types */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Experience Types</h3>
        
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={formData.isOnline || false}
              onCheckedChange={(checked) => onFormChange({ ...formData, isOnline: checked })}
            />
            <Label>Online Experiences</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={formData.isInPerson || false}
              onCheckedChange={(checked) => onFormChange({ ...formData, isInPerson: checked })}
            />
            <Label>In-Person Experiences</Label>
          </div>
        </div>

        <div>
          <Label>Cultural Experiences You Offer</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
            {['Cooking Classes', 'Traditional Crafts', 'Music Lessons', 'Dance Workshops', 'Art Classes', 'Calligraphy', 'Tea Ceremonies', 'Cultural Storytelling', 'Religious/Spiritual Practices', 'Traditional Games'].map((experience) => (
              <div key={experience} className="flex items-center space-x-2">
                <Checkbox
                  id={experience}
                  checked={formData.experienceTypes?.includes(experience) || false}
                  onCheckedChange={(checked) => {
                    const current = formData.experienceTypes || [];
                    const updated = checked 
                      ? [...current, experience]
                      : current.filter((e: string) => e !== experience);
                    onFormChange({ ...formData, experienceTypes: updated });
                  }}
                />
                <Label htmlFor={experience} className="text-sm">{experience}</Label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const EventVenueRegistrationForm = ({ formData, onFormChange }: { formData: any; onFormChange: (data: any) => void }) => {
  return (
    <div className="space-y-6">
      {/* Venue Info */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Building className="w-5 h-5" />
          Venue Information
        </h3>
        
        <div>
          <Label htmlFor="venueName">Venue Name</Label>
          <Input
            id="venueName"
            placeholder="Your venue name"
            value={formData.venueName || ''}
            onChange={(e) => onFormChange({ ...formData, venueName: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="venueAddress">Venue Address</Label>
          <Textarea
            id="venueAddress"
            placeholder="Full address of your venue..."
            value={formData.venueAddress || ''}
            onChange={(e) => onFormChange({ ...formData, venueAddress: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="capacity">Maximum Capacity</Label>
            <Input
              id="capacity"
              type="number"
              placeholder="Number of guests"
              value={formData.capacity || ''}
              onChange={(e) => onFormChange({ ...formData, capacity: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="venueType">Venue Type</Label>
            <Select
              value={formData.venueType || ''}
              onValueChange={(value) => onFormChange({ ...formData, venueType: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select venue type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="restaurant">Restaurant</SelectItem>
                <SelectItem value="cafe">Cafe</SelectItem>
                <SelectItem value="gallery">Art Gallery</SelectItem>
                <SelectItem value="museum">Museum</SelectItem>
                <SelectItem value="cultural_center">Cultural Center</SelectItem>
                <SelectItem value="community_hall">Community Hall</SelectItem>
                <SelectItem value="outdoor_space">Outdoor Space</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="venueDescription">Venue Description</Label>
          <Textarea
            id="venueDescription"
            placeholder="Describe your venue, its atmosphere, and what makes it special..."
            value={formData.venueDescription || ''}
            onChange={(e) => onFormChange({ ...formData, venueDescription: e.target.value })}
          />
        </div>
      </div>

      {/* Facilities & Amenities */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Facilities & Amenities</h3>
        
        <div>
          <Label>Available Facilities</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
            {['Sound System', 'Projector/Screen', 'Kitchen Access', 'Parking', 'WiFi', 'Air Conditioning', 'Outdoor Space', 'Stage/Platform', 'Lighting Equipment', 'Accessible Entrance'].map((facility) => (
              <div key={facility} className="flex items-center space-x-2">
                <Checkbox
                  id={facility}
                  checked={formData.facilities?.includes(facility) || false}
                  onCheckedChange={(checked) => {
                    const current = formData.facilities || [];
                    const updated = checked 
                      ? [...current, facility]
                      : current.filter((f: string) => f !== facility);
                    onFormChange({ ...formData, facilities: updated });
                  }}
                />
                <Label htmlFor={facility} className="text-sm">{facility}</Label>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Event Types */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Preferred Event Types</h3>
        
        <div>
          <Label>Types of Events You Host</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
            {['Cultural Workshops', 'Art Exhibitions', 'Music Performances', 'Food Events', 'Language Exchange', 'Community Gatherings', 'Educational Events', 'Networking Events', 'Private Parties', 'Corporate Events'].map((eventType) => (
              <div key={eventType} className="flex items-center space-x-2">
                <Checkbox
                  id={eventType}
                  checked={formData.eventTypes?.includes(eventType) || false}
                  onCheckedChange={(checked) => {
                    const current = formData.eventTypes || [];
                    const updated = checked 
                      ? [...current, eventType]
                      : current.filter((e: string) => e !== eventType);
                    onFormChange({ ...formData, eventTypes: updated });
                  }}
                />
                <Label htmlFor={eventType} className="text-sm">{eventType}</Label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const RegistrationFormRenderer = ({ userType, formData, onFormChange }: RegistrationFormProps) => {
  switch (userType) {
    case 'traveler':
      return <TravelerRegistrationForm formData={formData} onFormChange={onFormChange} />;
    case 'tour_operator':
      return <TourOperatorRegistrationForm formData={formData} onFormChange={onFormChange} />;
    case 'language_teacher':
      return <LanguageTeacherRegistrationForm formData={formData} onFormChange={onFormChange} />;
    case 'cultural_experience':
      return <CulturalExperienceRegistrationForm formData={formData} onFormChange={onFormChange} />;
    case 'event_venue':
      return <EventVenueRegistrationForm formData={formData} onFormChange={onFormChange} />;
    default:
      return <TravelerRegistrationForm formData={formData} onFormChange={onFormChange} />;
  }
};