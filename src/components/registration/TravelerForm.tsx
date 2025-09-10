import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Upload, X, Plus, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Language {
  code: string;
  name: string;
  fluency: 'beginner' | 'intermediate' | 'advanced' | 'native';
  isPrimary: boolean;
}

interface SocialMedia {
  platform: string;
  username: string;
}

const TravelerForm: React.FC = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    birthdate: '',
    homeCity: '',
    upcomingTravel: '',
    bio: '',
    profileImage: null as File | null
  });

  const [languages, setLanguages] = useState<Language[]>([]);
  const [newLanguage, setNewLanguage] = useState({ code: '', name: '', fluency: 'beginner' as const });
  const [interests, setInterests] = useState<string[]>([]);
  const [customInterests, setCustomInterests] = useState<string[]>([]);
  const [newCustomInterest, setNewCustomInterest] = useState('');
  const [socialMedia, setSocialMedia] = useState<SocialMedia[]>([]);
  const [dreamDestinations, setDreamDestinations] = useState<string[]>([]);
  const [newDestination, setNewDestination] = useState('');

  const predefinedInterests = [
    'music', 'art', 'theater', 'film', 'tech', 'founder', 
    'sports', 'nature', 'family', 'expat', 'food', 'history',
    'photography', 'adventure', 'culture', 'languages'
  ];

  const socialPlatforms = [
    'TikTok', 'Instagram', 'Facebook', 'WeChat', 'Douyin', 
    'X', 'WhatsApp', 'Telegram', 'Line'
  ];

  const commonLanguages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ru', name: 'Russian' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'zh', name: 'Chinese' },
    { code: 'ar', name: 'Arabic' },
    { code: 'hi', name: 'Hindi' },
    { code: 'th', name: 'Thai' }
  ];

  const handleInterestToggle = (interest: string) => {
    setInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const addCustomInterest = () => {
    if (newCustomInterest.trim() && !customInterests.includes(newCustomInterest.trim())) {
      setCustomInterests(prev => [...prev, newCustomInterest.trim()]);
      setNewCustomInterest('');
    }
  };

  const removeCustomInterest = (interest: string) => {
    setCustomInterests(prev => prev.filter(i => i !== interest));
  };

  const addLanguage = () => {
    if (newLanguage.code && newLanguage.name) {
      const language: Language = {
        ...newLanguage,
        isPrimary: languages.length === 0
      };
      setLanguages(prev => [...prev, language]);
      setNewLanguage({ code: '', name: '', fluency: 'beginner' });
    }
  };

  const addDreamDestination = () => {
    if (newDestination.trim() && !dreamDestinations.includes(newDestination.trim())) {
      setDreamDestinations(prev => [...prev, newDestination.trim()]);
      setNewDestination('');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, profileImage: file }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.firstName || !formData.lastName || !formData.birthdate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    if (languages.length === 0) {
      toast({
        title: "Language Required",
        description: "Please add at least one language.",
        variant: "destructive"
      });
      return;
    }

    try {
      // Here you would submit to your backend
      console.log('Traveler form data:', {
        ...formData,
        languages,
        interests: [...interests, ...customInterests],
        socialMedia,
        dreamDestinations
      });

      toast({
        title: "Profile Created!",
        description: "Welcome to Travelogie! Your traveler profile has been created successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create profile. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <MapPin className="w-6 h-6 text-primary" />
            Create Your Traveler Profile
          </CardTitle>
          <CardDescription>
            Tell us about yourself and your travel interests to connect with amazing local experiences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Profile Image Upload */}
            <div className="space-y-2">
              <Label>Profile Photo</Label>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 border-2 border-dashed border-muted-foreground rounded-lg flex items-center justify-center">
                  {formData.profileImage ? (
                    <img 
                      src={URL.createObjectURL(formData.profileImage)} 
                      alt="Profile" 
                      className="w-full h-full object-cover rounded-lg" 
                    />
                  ) : (
                    <Upload className="w-6 h-6 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="profile-image"
                  />
                  <Label htmlFor="profile-image">
                    <Button type="button" variant="outline" asChild>
                      <span>Upload Photo</span>
                    </Button>
                  </Label>
                </div>
              </div>
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="birthdate">Birthdate *</Label>
                <Input
                  id="birthdate"
                  type="date"
                  value={formData.birthdate}
                  onChange={(e) => setFormData(prev => ({ ...prev, birthdate: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="homeCity">Home City</Label>
                <Input
                  id="homeCity"
                  value={formData.homeCity}
                  onChange={(e) => setFormData(prev => ({ ...prev, homeCity: e.target.value }))}
                  placeholder="e.g., New York, USA"
                />
              </div>
            </div>

            {/* Travel Information */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="upcomingTravel">Upcoming Travel Plans</Label>
                <Textarea
                  id="upcomingTravel"
                  value={formData.upcomingTravel}
                  onChange={(e) => setFormData(prev => ({ ...prev, upcomingTravel: e.target.value }))}
                  placeholder="Tell us about your upcoming trips..."
                />
              </div>

              <div className="space-y-2">
                <Label>Travel Dream List</Label>
                <div className="flex gap-2">
                  <Input
                    value={newDestination}
                    onChange={(e) => setNewDestination(e.target.value)}
                    placeholder="Add a dream destination"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addDreamDestination())}
                  />
                  <Button type="button" onClick={addDreamDestination} size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {dreamDestinations.map((dest, index) => (
                    <Badge key={index} variant="secondary">
                      {dest}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="ml-1 h-auto p-0"
                        onClick={() => setDreamDestinations(prev => prev.filter((_, i) => i !== index))}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Languages */}
            <div className="space-y-4">
              <Label>Languages Spoken *</Label>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                <Select value={newLanguage.code} onValueChange={(value) => {
                  const lang = commonLanguages.find(l => l.code === value);
                  if (lang) {
                    setNewLanguage(prev => ({ ...prev, code: lang.code, name: lang.name }));
                  }
                }}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    {commonLanguages.map(lang => (
                      <SelectItem key={lang.code} value={lang.code}>{lang.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={newLanguage.fluency} onValueChange={(value: any) => setNewLanguage(prev => ({ ...prev, fluency: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Fluency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                    <SelectItem value="native">Native</SelectItem>
                  </SelectContent>
                </Select>
                <Button type="button" onClick={addLanguage} className="md:col-span-2">
                  Add Language
                </Button>
              </div>
              <div className="space-y-2">
                {languages.map((lang, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded">
                    <span>{lang.name} - {lang.fluency} {lang.isPrimary && '(Primary)'}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setLanguages(prev => prev.filter((_, i) => i !== index))}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            {/* Interests */}
            <div className="space-y-4">
              <Label>Interests</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {predefinedInterests.map(interest => (
                  <div key={interest} className="flex items-center space-x-2">
                    <Checkbox
                      id={interest}
                      checked={interests.includes(interest)}
                      onCheckedChange={() => handleInterestToggle(interest)}
                    />
                    <Label htmlFor={interest} className="text-sm capitalize">
                      {interest}
                    </Label>
                  </div>
                ))}
              </div>
              
              <div className="space-y-2">
                <Label>Custom Interests</Label>
                <div className="flex gap-2">
                  <Input
                    value={newCustomInterest}
                    onChange={(e) => setNewCustomInterest(e.target.value)}
                    placeholder="Add custom interest"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomInterest())}
                  />
                  <Button type="button" onClick={addCustomInterest} size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {customInterests.map((interest, index) => (
                    <Badge key={index} variant="outline">
                      {interest}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="ml-1 h-auto p-0"
                        onClick={() => removeCustomInterest(interest)}
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio">About You</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="Tell us about yourself, your travel style, and what you're looking for..."
                rows={4}
              />
            </div>

            <Button type="submit" className="w-full" size="lg">
              Create Traveler Profile
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default TravelerForm;