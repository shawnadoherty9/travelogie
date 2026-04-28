import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Upload, X, Plus, Palette, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { validateRequiredFields, validateAtLeastOneOffering, validateOfferingFields, clearOfferingErrors, clearFieldError, useFieldChange, getErrorMessage, toRegistrationError, type FieldErrors } from "@/utils/registrationValidation";

interface CulturalExperience {
  title: string;
  description: string;
  category: string;
  duration: number;
  price: number;
  maxParticipants: number;
  isOnline: boolean;
  isInPerson: boolean;
  skillLevel: string;
  materialsProvided: string;
}

const CulturalExperienceForm: React.FC = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    birthdate: '',
    homeCity: '',
    bio: '',
    profileImage: null as File | null,
    culturalBackground: '',
    experienceYears: ''
  });

  const [experiences, setExperiences] = useState<CulturalExperience[]>([]);
  const [currentExperience, setCurrentExperience] = useState<CulturalExperience>({
    title: '',
    description: '',
    category: '',
    duration: 2,
    price: 40,
    maxParticipants: 6,
    isOnline: false,
    isInPerson: true,
    skillLevel: 'beginner',
    materialsProvided: ''
  });

  const [spokenLanguages, setSpokenLanguages] = useState<Array<{code: string, name: string, fluency: string}>>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [customInterests, setCustomInterests] = useState<string[]>([]);
  const [newCustomInterest, setNewCustomInterest] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const handleChange = useFieldChange(setFormData, setFieldErrors);

  const experienceCategories = [
    'Cooking & Cuisine',
    'Arts & Crafts',
    'Music & Dance',
    'Traditional Ceremonies',
    'Storytelling',
    'Calligraphy & Writing',
    'Textile Arts',
    'Religious Practices',
    'Folk Games',
    'Tea/Coffee Ceremonies',
    'Language & Communication',
    'Traditional Medicine',
    'Architecture & Design',
    'Martial Arts',
    'Agricultural Practices'
  ];

  const skillLevels = [
    { value: 'beginner', label: 'Beginner Friendly' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
    { value: 'all_levels', label: 'All Levels' }
  ];

  const predefinedInterests = [
    'traditional arts', 'modern fusion', 'religious culture', 'secular culture',
    'family traditions', 'community practices', 'historical context', 'contemporary adaptation',
    'storytelling', 'hands-on learning', 'cultural exchange', 'heritage preservation'
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

  const addExperience = () => {
    const expErrors = validateOfferingFields([
      { key: 'expTitle', value: currentExperience.title, label: 'Experience title' },
      { key: 'expDescription', value: currentExperience.description, label: 'Experience description' },
      { key: 'expCategory', value: currentExperience.category, label: 'Category' },
    ]);
    if (Object.keys(expErrors).length > 0) {
      setFieldErrors(prev => ({ ...prev, ...expErrors }));
      toast({ title: "Incomplete Experience", description: "Please fill in the title, description, and category.", variant: "destructive" });
      return;
    }
    setFieldErrors(prev => clearOfferingErrors(prev, ['expTitle', 'expDescription', 'expCategory']));
    setExperiences(prev => [...prev, { ...currentExperience }]);
    setCurrentExperience({ title: '', description: '', category: '', duration: 2, price: 40, maxParticipants: 6, isOnline: false, isInPerson: true, skillLevel: 'beginner', materialsProvided: '' });
  };

  const removeExperience = (index: number) => {
    setExperiences(prev => prev.filter((_, i) => i !== index));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, profileImage: file }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({ title: "Error", description: "You must be logged in.", variant: "destructive" });
      return;
    }

    const errors: FieldErrors = {
      ...validateRequiredFields([
        { key: 'firstName', value: formData.firstName, label: 'First name' },
        { key: 'lastName', value: formData.lastName, label: 'Last name' },
        { key: 'birthdate', value: formData.birthdate, label: 'Birthdate' },
      ]),
      ...validateAtLeastOneOffering(experiences, 'experiences', 'cultural experience'),
    };
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      toast({ title: "Missing Information", description: "Please fix the highlighted fields below.", variant: "destructive" });
      return;
    }

    try {
      // Update profile
      const { error: profileError } = await supabase.from('profiles').update({
        user_type: 'cultural_experience',
        first_name: formData.firstName,
        last_name: formData.lastName,
        birthdate: formData.birthdate,
        home_city: formData.homeCity,
        bio: formData.bio,
        interests,
        custom_interests: customInterests,
      }).eq('user_id', user.id);
      if (profileError) throw profileError;

      // Insert spoken languages
      if (spokenLanguages.length > 0) {
        const { error: langError } = await supabase.from('user_languages').insert(
          spokenLanguages.map(lang => ({
            user_id: user.id,
            language_code: lang.code,
            language_name: lang.name,
            fluency_level: lang.fluency,
            is_primary: false,
          }))
        );
        if (langError) throw langError;
      }

      // Create services from cultural experiences
      for (const exp of experiences) {
        await supabase.from('services').insert({
          user_id: user.id,
          title: exp.title,
          description: exp.description,
          service_type: 'cultural_experience',
          duration_hours: exp.duration,
          price_per_hour: exp.price / exp.duration,
          max_participants: exp.maxParticipants,
          is_online: exp.isOnline,
          is_in_person: exp.isInPerson,
          skill_level: exp.skillLevel,
          equipment_needed: exp.materialsProvided,
        });
      }

      // Assign role
      await supabase.rpc('assign_registration_role', { p_role: 'cultural_guide' });

      toast({ title: "Profile Created!", description: "Your cultural experience host profile has been created successfully." });
      navigate('/dashboard');
    } catch (error: unknown) {
      const normalized = toRegistrationError(error, "Failed to create profile. Please try again.");
      console.error('Registration error:', normalized);
      toast({
        title: normalized.kind === 'validation' ? "Validation Error" : "Error",
        description: normalized.message,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Palette className="w-6 h-6 text-primary" />
            Create Your Cultural Experience Host Profile
          </CardTitle>
          <CardDescription>
            Share your cultural heritage and create meaningful experiences for curious travelers
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
                  onChange={handleChange('firstName')}
                  className={fieldErrors.firstName ? 'border-destructive' : ''}
                />
                {fieldErrors.firstName && <p className="text-sm text-destructive">{fieldErrors.firstName}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={handleChange('lastName')}
                  className={fieldErrors.lastName ? 'border-destructive' : ''}
                />
                {fieldErrors.lastName && <p className="text-sm text-destructive">{fieldErrors.lastName}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="birthdate">Birthdate *</Label>
                <Input
                  id="birthdate"
                  type="date"
                  value={formData.birthdate}
                  onChange={handleChange('birthdate')}
                  className={fieldErrors.birthdate ? 'border-destructive' : ''}
                />
                {fieldErrors.birthdate && <p className="text-sm text-destructive">{fieldErrors.birthdate}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="homeCity">Home City</Label>
                <Input
                  id="homeCity"
                  value={formData.homeCity}
                  onChange={(e) => setFormData(prev => ({ ...prev, homeCity: e.target.value }))}
                  placeholder="e.g., Kyoto, Japan"
                />
              </div>
            </div>

            {/* Cultural Background */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="culturalBackground">Cultural Background & Heritage</Label>
                <Textarea
                  id="culturalBackground"
                  value={formData.culturalBackground}
                  onChange={(e) => setFormData(prev => ({ ...prev, culturalBackground: e.target.value }))}
                  placeholder="Describe your cultural heritage, traditions, and background..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="experienceYears">Experience in Cultural Sharing</Label>
                <Textarea
                  id="experienceYears"
                  value={formData.experienceYears}
                  onChange={(e) => setFormData(prev => ({ ...prev, experienceYears: e.target.value }))}
                  placeholder="How long have you been sharing your culture? Any formal training or certifications?"
                  rows={3}
                />
              </div>
            </div>

            {/* Cultural Experiences */}
            <div className="space-y-4">
              <Label className="text-lg">Cultural Experiences Offered *</Label>
              {fieldErrors.experiences && <p className="text-sm text-destructive">{fieldErrors.experiences}</p>}
              
              {/* Add New Experience */}
              <Card className="border-dashed">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Add Cultural Experience
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Experience Title</Label>
                      <Input
                        value={currentExperience.title}
                        onChange={(e) => setCurrentExperience(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="e.g., Traditional Japanese Tea Ceremony"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Category</Label>
                      <Select value={currentExperience.category} onValueChange={(value) => setCurrentExperience(prev => ({ ...prev, category: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {experienceCategories.map(category => (
                            <SelectItem key={category} value={category}>{category}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Experience Description</Label>
                    <Textarea
                      value={currentExperience.description}
                      onChange={(e) => setCurrentExperience(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe the cultural experience, what participants will learn and do..."
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Experience Format</Label>
                      <div className="flex gap-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="experienceOnline"
                            checked={currentExperience.isOnline}
                            onCheckedChange={(checked) => setCurrentExperience(prev => ({ ...prev, isOnline: !!checked }))}
                          />
                          <Label htmlFor="experienceOnline" className="text-sm">
                            Online
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="experienceInPerson"
                            checked={currentExperience.isInPerson}
                            onCheckedChange={(checked) => setCurrentExperience(prev => ({ ...prev, isInPerson: !!checked }))}
                          />
                          <Label htmlFor="experienceInPerson" className="text-sm">
                            In-Person
                          </Label>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Skill Level</Label>
                      <Select value={currentExperience.skillLevel} onValueChange={(value) => setCurrentExperience(prev => ({ ...prev, skillLevel: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {skillLevels.map(level => (
                            <SelectItem key={level.value} value={level.value}>{level.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Duration (hours)</Label>
                      <Input
                        type="number"
                        min="0.5"
                        step="0.5"
                        value={currentExperience.duration}
                        onChange={(e) => setCurrentExperience(prev => ({ ...prev, duration: parseFloat(e.target.value) || 2 }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Price (USD)</Label>
                      <Input
                        type="number"
                        min="1"
                        value={currentExperience.price}
                        onChange={(e) => setCurrentExperience(prev => ({ ...prev, price: parseInt(e.target.value) || 40 }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Max Participants</Label>
                      <Input
                        type="number"
                        min="1"
                        value={currentExperience.maxParticipants}
                        onChange={(e) => setCurrentExperience(prev => ({ ...prev, maxParticipants: parseInt(e.target.value) || 6 }))}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Materials Provided</Label>
                    <Textarea
                      value={currentExperience.materialsProvided}
                      onChange={(e) => setCurrentExperience(prev => ({ ...prev, materialsProvided: e.target.value }))}
                      placeholder="What materials, tools, or supplies will you provide to participants?"
                      rows={2}
                    />
                  </div>

                  <Button type="button" onClick={addExperience} className="w-full">
                    Add Cultural Experience
                  </Button>
                </CardContent>
              </Card>

              {/* Existing Experiences */}
              {experiences.length > 0 && (
                <div className="space-y-2">
                  <Label>Your Cultural Experiences</Label>
                  {experiences.map((experience, index) => (
                    <Card key={index}>
                      <CardContent className="pt-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-medium">{experience.title}</h4>
                            <p className="text-sm text-muted-foreground">{experience.description}</p>
                            <div className="flex gap-4 text-sm text-muted-foreground mt-2 flex-wrap">
                              <span>{experience.duration}h</span>
                              <span>${experience.price}</span>
                              <span>Max {experience.maxParticipants} people</span>
                              <Badge variant="outline">{experience.category}</Badge>
                              <Badge variant="secondary">{experience.skillLevel}</Badge>
                              {experience.isOnline && <Badge variant="outline" className="text-xs">Online</Badge>}
                              {experience.isInPerson && <Badge variant="outline" className="text-xs">In-Person</Badge>}
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeExperience(index)}
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

            {/* Languages Spoken */}
            <div className="space-y-4">
              <Label className="text-lg">Languages Spoken</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Primary Language</Label>
                  <Select onValueChange={(value) => {
                    const [code, name] = value.split('|');
                    setSpokenLanguages(prev => [
                      ...prev.filter(l => l.fluency !== 'native'),
                      { code, name, fluency: 'native' }
                    ]);
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select primary language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en|English">English</SelectItem>
                      <SelectItem value="es|Spanish">Spanish</SelectItem>
                      <SelectItem value="fr|French">French</SelectItem>
                      <SelectItem value="de|German">German</SelectItem>
                      <SelectItem value="it|Italian">Italian</SelectItem>
                      <SelectItem value="pt|Portuguese">Portuguese</SelectItem>
                      <SelectItem value="ja|Japanese">Japanese</SelectItem>
                      <SelectItem value="ko|Korean">Korean</SelectItem>
                      <SelectItem value="zh|Chinese">Chinese</SelectItem>
                      <SelectItem value="ar|Arabic">Arabic</SelectItem>
                      <SelectItem value="hi|Hindi">Hindi</SelectItem>
                      <SelectItem value="th|Thai">Thai</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Additional Languages</Label>
                  <div className="flex gap-2">
                    <Select onValueChange={(value) => {
                      const [code, name] = value.split('|');
                      if (!spokenLanguages.find(l => l.code === code)) {
                        setSpokenLanguages(prev => [...prev, { code, name, fluency: 'conversational' }]);
                      }
                    }}>
                      <SelectTrigger>
                        <SelectValue placeholder="Add language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en|English">English</SelectItem>
                        <SelectItem value="es|Spanish">Spanish</SelectItem>
                        <SelectItem value="fr|French">French</SelectItem>
                        <SelectItem value="de|German">German</SelectItem>
                        <SelectItem value="it|Italian">Italian</SelectItem>
                        <SelectItem value="pt|Portuguese">Portuguese</SelectItem>
                        <SelectItem value="ja|Japanese">Japanese</SelectItem>
                        <SelectItem value="ko|Korean">Korean</SelectItem>
                        <SelectItem value="zh|Chinese">Chinese</SelectItem>
                        <SelectItem value="ar|Arabic">Arabic</SelectItem>
                        <SelectItem value="hi|Hindi">Hindi</SelectItem>
                        <SelectItem value="th|Thai">Thai</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {spokenLanguages.filter(lang => lang.fluency !== 'native').map((lang, index) => (
                      <Badge key={index} variant="outline" className="flex items-center gap-1">
                        {lang.name} ({lang.fluency})
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-auto p-0 ml-1"
                          onClick={() => setSpokenLanguages(prev => prev.filter(l => l.code !== lang.code))}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Cultural Interests/Specialties */}
            <div className="space-y-4">
              <Label>Cultural Specialties & Interests</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
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
                placeholder="Tell visitors about your passion for sharing your culture, your personal story, and what makes your experiences special..."
                rows={4}
              />
            </div>

            <Button type="submit" className="w-full" size="lg">
              Create Cultural Experience Host Profile
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CulturalExperienceForm;
