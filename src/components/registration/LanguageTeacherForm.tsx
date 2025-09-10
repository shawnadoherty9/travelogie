import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Upload, X, Plus, BookOpen, Video } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LanguageOffering {
  language: string;
  skillLevels: string[];
  isOnline: boolean;
  isInPerson: boolean;
  pricePerHour: number;
  description: string;
}

const LanguageTeacherForm: React.FC = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    birthdate: '',
    homeCity: '',
    bio: '',
    profileImage: null as File | null,
    teachingExperience: '',
    certifications: ''
  });

  const [languageOfferings, setLanguageOfferings] = useState<LanguageOffering[]>([]);
  const [currentOffering, setCurrentOffering] = useState<LanguageOffering>({
    language: '',
    skillLevels: [],
    isOnline: true,
    isInPerson: false,
    pricePerHour: 25,
    description: ''
  });

  const [spokenLanguages, setSpokenLanguages] = useState<Array<{code: string, name: string, fluency: string}>>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [customInterests, setCustomInterests] = useState<string[]>([]);
  const [newCustomInterest, setNewCustomInterest] = useState('');

  const commonLanguages = [
    'English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 
    'Russian', 'Japanese', 'Korean', 'Chinese (Mandarin)', 'Chinese (Cantonese)',
    'Arabic', 'Hindi', 'Thai', 'Vietnamese', 'Dutch', 'Swedish', 'Norwegian'
  ];

  const skillLevels = ['beginner', 'intermediate', 'advanced'];
  
  const predefinedInterests = [
    'business', 'travel', 'literature', 'culture', 'technology', 'science',
    'arts', 'music', 'sports', 'cooking', 'history', 'current events'
  ];

  const handleSkillLevelToggle = (level: string) => {
    setCurrentOffering(prev => ({
      ...prev,
      skillLevels: prev.skillLevels.includes(level)
        ? prev.skillLevels.filter(l => l !== level)
        : [...prev.skillLevels, level]
    }));
  };

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

  const addLanguageOffering = () => {
    if (currentOffering.language && currentOffering.skillLevels.length > 0) {
      setLanguageOfferings(prev => [...prev, { ...currentOffering }]);
      setCurrentOffering({
        language: '',
        skillLevels: [],
        isOnline: true,
        isInPerson: false,
        pricePerHour: 25,
        description: ''
      });
    }
  };

  const removeLanguageOffering = (index: number) => {
    setLanguageOfferings(prev => prev.filter((_, i) => i !== index));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, profileImage: file }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.birthdate) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    if (languageOfferings.length === 0) {
      toast({
        title: "Language Required",
        description: "Please add at least one language offering.",
        variant: "destructive"
      });
      return;
    }

    try {
      console.log('Language Teacher form data:', {
        ...formData,
        languageOfferings,
        spokenLanguages,
        interests: [...interests, ...customInterests]
      });

      toast({
        title: "Profile Created!",
        description: "Welcome to Travelogie! Your language teacher profile has been created successfully.",
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
            <BookOpen className="w-6 h-6 text-primary" />
            Create Your Language Teacher Profile
          </CardTitle>
          <CardDescription>
            Share your language expertise and help students learn through immersive experiences
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
                  placeholder="e.g., Paris, France"
                />
              </div>
            </div>

            {/* Teaching Experience */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="teachingExperience">Teaching Experience</Label>
                <Textarea
                  id="teachingExperience"
                  value={formData.teachingExperience}
                  onChange={(e) => setFormData(prev => ({ ...prev, teachingExperience: e.target.value }))}
                  placeholder="Describe your teaching experience, years of experience, types of students you've taught..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="certifications">Certifications & Qualifications</Label>
                <Textarea
                  id="certifications"
                  value={formData.certifications}
                  onChange={(e) => setFormData(prev => ({ ...prev, certifications: e.target.value }))}
                  placeholder="List your language teaching certifications, degrees, or qualifications (TEFL, TESOL, etc.)"
                  rows={3}
                />
              </div>
            </div>

            {/* Language Offerings */}
            <div className="space-y-4">
              <Label className="text-lg">Language Lessons Offered *</Label>
              
              {/* Add New Language Offering */}
              <Card className="border-dashed">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Video className="w-5 h-5" />
                    Add Language Lesson
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Language</Label>
                      <Select value={currentOffering.language} onValueChange={(value) => setCurrentOffering(prev => ({ ...prev, language: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          {commonLanguages.map(lang => (
                            <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Price per Hour (USD)</Label>
                      <Input
                        type="number"
                        min="1"
                        value={currentOffering.pricePerHour}
                        onChange={(e) => setCurrentOffering(prev => ({ ...prev, pricePerHour: parseInt(e.target.value) || 25 }))}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Skill Levels Taught</Label>
                    <div className="flex gap-4">
                      {skillLevels.map(level => (
                        <div key={level} className="flex items-center space-x-2">
                          <Checkbox
                            id={level}
                            checked={currentOffering.skillLevels.includes(level)}
                            onCheckedChange={() => handleSkillLevelToggle(level)}
                          />
                          <Label htmlFor={level} className="text-sm capitalize">
                            {level}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Lesson Format</Label>
                    <div className="flex gap-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="online"
                          checked={currentOffering.isOnline}
                          onCheckedChange={(checked) => setCurrentOffering(prev => ({ ...prev, isOnline: !!checked }))}
                        />
                        <Label htmlFor="online" className="text-sm">
                          Online Lessons
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="inPerson"
                          checked={currentOffering.isInPerson}
                          onCheckedChange={(checked) => setCurrentOffering(prev => ({ ...prev, isInPerson: !!checked }))}
                        />
                        <Label htmlFor="inPerson" className="text-sm">
                          In-Person Lessons
                        </Label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Lesson Description</Label>
                    <Textarea
                      value={currentOffering.description}
                      onChange={(e) => setCurrentOffering(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe your teaching style, lesson structure, materials used..."
                      rows={3}
                    />
                  </div>

                  <Button type="button" onClick={addLanguageOffering} className="w-full">
                    Add Language Lesson
                  </Button>
                </CardContent>
              </Card>

              {/* Existing Language Offerings */}
              {languageOfferings.length > 0 && (
                <div className="space-y-2">
                  <Label>Your Language Lessons</Label>
                  {languageOfferings.map((offering, index) => (
                    <Card key={index}>
                      <CardContent className="pt-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-medium">{offering.language} Lessons</h4>
                            <p className="text-sm text-muted-foreground">{offering.description}</p>
                            <div className="flex gap-4 text-sm text-muted-foreground mt-2 flex-wrap">
                              <span>${offering.pricePerHour}/hour</span>
                              <div className="flex gap-1">
                                {offering.skillLevels.map(level => (
                                  <Badge key={level} variant="outline" className="text-xs">{level}</Badge>
                                ))}
                              </div>
                              <div className="flex gap-1">
                                {offering.isOnline && <Badge variant="secondary" className="text-xs">Online</Badge>}
                                {offering.isInPerson && <Badge variant="secondary" className="text-xs">In-Person</Badge>}
                              </div>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeLanguageOffering(index)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Teaching Interests/Specialties */}
            <div className="space-y-4">
              <Label>Teaching Specialties & Interests</Label>
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
                <Label>Custom Specialties</Label>
                <div className="flex gap-2">
                  <Input
                    value={newCustomInterest}
                    onChange={(e) => setNewCustomInterest(e.target.value)}
                    placeholder="Add custom specialty"
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
                        onClick={() => setCustomInterests(prev => prev.filter(i => i !== interest))}
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
                placeholder="Tell students about your teaching philosophy, what you enjoy about language teaching, and what makes your lessons special..."
                rows={4}
              />
            </div>

            <Button type="submit" className="w-full" size="lg">
              Create Language Teacher Profile
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LanguageTeacherForm;
