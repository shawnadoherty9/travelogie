import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { FileUpload } from "@/components/ui/file-upload";
import { CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";

interface TravelerRegistrationProps {
  onComplete: (data: any) => void;
  onBack: () => void;
}

const TravelerRegistration = ({ onComplete, onBack }: TravelerRegistrationProps) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    birthdate: undefined as Date | undefined,
    homeCity: '',
    bio: '',
    upcomingTravel: '',
    languages: [] as Array<{code: string, name: string, fluency: string, isPrimary: boolean}>,
    interests: [] as string[],
    customInterests: '',
    socialMedia: {} as Record<string, string>,
    profileImageUrl: ''
  });

  const [currentLanguage, setCurrentLanguage] = useState({
    code: '',
    name: '',
    fluency: 'beginner' as string,
    isPrimary: false
  });

  const predefinedInterests = [
    'music', 'art', 'theater', 'film', 'tech', 'founder', 'sports', 
    'nature', 'family', 'expat', 'food', 'photography', 'history', 
    'architecture', 'adventure', 'wellness', 'nightlife'
  ];

  const socialMediaPlatforms = [
    { key: 'instagram', label: 'Instagram' },
    { key: 'tiktok', label: 'TikTok' },
    { key: 'facebook', label: 'Facebook' },
    { key: 'wechat', label: 'WeChat' },
    { key: 'x', label: 'X (Twitter)' },
    { key: 'whatsapp', label: 'WhatsApp' },
    { key: 'telegram', label: 'Telegram' },
    { key: 'line', label: 'Line' }
  ];

  const fluencyLevels = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
    { value: 'native', label: 'Native' }
  ];

  const addLanguage = () => {
    if (currentLanguage.name && currentLanguage.code) {
      setFormData(prev => ({
        ...prev,
        languages: [...prev.languages, currentLanguage]
      }));
      setCurrentLanguage({ code: '', name: '', fluency: 'beginner', isPrimary: false });
    }
  };

  const removeLanguage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.filter((_, i) => i !== index)
    }));
  };

  const toggleInterest = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onComplete({
      ...formData,
      userType: 'traveler'
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Button variant="ghost" onClick={onBack} className="mb-6">
        ← Back to User Types
      </Button>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Traveler Registration</CardTitle>
          <p className="text-muted-foreground">Tell us about yourself and your travel interests</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                    required
                  />
                </div>
                <div>
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
                <div>
                  <Label>Birthdate</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.birthdate ? format(formData.birthdate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.birthdate}
                        onSelect={(date) => setFormData(prev => ({ ...prev, birthdate: date }))}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label htmlFor="homeCity">Home City *</Label>
                  <Input
                    id="homeCity"
                    value={formData.homeCity}
                    onChange={(e) => setFormData(prev => ({ ...prev, homeCity: e.target.value }))}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell other travelers about yourself..."
                  value={formData.bio}
                  onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="upcomingTravel">Upcoming Travel Plans</Label>
                <Textarea
                  id="upcomingTravel"
                  placeholder="Where are you planning to travel next?"
                  value={formData.upcomingTravel}
                  onChange={(e) => setFormData(prev => ({ ...prev, upcomingTravel: e.target.value }))}
                  rows={2}
                />
              </div>
            </div>

            {/* Languages */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Languages Spoken</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="langCode">Language Code</Label>
                  <Input
                    id="langCode"
                    placeholder="en, es, fr..."
                    value={currentLanguage.code}
                    onChange={(e) => setCurrentLanguage(prev => ({ ...prev, code: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="langName">Language Name</Label>
                  <Input
                    id="langName"
                    placeholder="English, Spanish..."
                    value={currentLanguage.name}
                    onChange={(e) => setCurrentLanguage(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>Fluency Level</Label>
                  <Select
                    value={currentLanguage.fluency}
                    onValueChange={(value) => setCurrentLanguage(prev => ({ ...prev, fluency: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {fluencyLevels.map(level => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button type="button" onClick={addLanguage} className="w-full">
                    Add Language
                  </Button>
                </div>
              </div>
              
              {formData.languages.length > 0 && (
                <div className="space-y-2">
                  <Label>Your Languages</Label>
                  <div className="flex flex-wrap gap-2">
                    {formData.languages.map((lang, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-2">
                        {lang.name} ({lang.fluency})
                        <X
                          className="w-3 h-3 cursor-pointer"
                          onClick={() => removeLanguage(index)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Interests */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Interests</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {predefinedInterests.map(interest => (
                  <div key={interest} className="flex items-center space-x-2">
                    <Checkbox
                      id={interest}
                      checked={formData.interests.includes(interest)}
                      onCheckedChange={() => toggleInterest(interest)}
                    />
                    <Label htmlFor={interest} className="capitalize">
                      {interest}
                    </Label>
                  </div>
                ))}
              </div>
              
              <div>
                <Label htmlFor="customInterests">Other Interests</Label>
                <Input
                  id="customInterests"
                  placeholder="Add your own interests, separated by commas"
                  value={formData.customInterests}
                  onChange={(e) => setFormData(prev => ({ ...prev, customInterests: e.target.value }))}
                />
              </div>
            </div>

            {/* Social Media */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Social Media (Optional)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {socialMediaPlatforms.map(platform => (
                  <div key={platform.key}>
                    <Label htmlFor={platform.key}>{platform.label}</Label>
                    <Input
                      id={platform.key}
                      placeholder={`Your ${platform.label} username`}
                      value={formData.socialMedia[platform.key] || ''}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        socialMedia: { ...prev.socialMedia, [platform.key]: e.target.value }
                      }))}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Profile Photo Upload */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Profile Photo</h3>
              <p className="text-sm text-muted-foreground">
                Add a profile photo to help locals recognize you and build trust
              </p>
              <FileUpload
                onUpload={(url) => setFormData(prev => ({ ...prev, profileImageUrl: url }))}
                currentImageUrl={formData.profileImageUrl}
                bucket="avatars"
                variant="avatar"
                maxSize={5}
                accept="image/*"
              />
            </div>

            <Button type="submit" className="w-full" size="lg">
              Complete Registration
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default TravelerRegistration;