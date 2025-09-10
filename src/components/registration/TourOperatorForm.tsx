import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Upload, X, Plus, MapPin, Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TourOffering {
  title: string;
  description: string;
  duration: number;
  price: number;
  maxParticipants: number;
  type: 'walking' | 'driving' | 'cycling' | 'boat' | 'cultural' | 'food' | 'adventure' | 'custom';
}

const TourOperatorForm: React.FC = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    birthdate: '',
    homeCity: '',
    geographicAvailability: '',
    bio: '',
    profileImage: null as File | null
  });

  const [tours, setTours] = useState<TourOffering[]>([]);
  const [currentTour, setCurrentTour] = useState<TourOffering>({
    title: '',
    description: '',
    duration: 2,
    price: 50,
    maxParticipants: 8,
    type: 'walking'
  });

  const [languages, setLanguages] = useState<Array<{code: string, name: string, fluency: string}>>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [customInterests, setCustomInterests] = useState<string[]>([]);
  const [newCustomInterest, setNewCustomInterest] = useState('');

  const tourTypes = [
    { value: 'walking', label: 'Walking Tour' },
    { value: 'driving', label: 'Driving Tour' },
    { value: 'cycling', label: 'Cycling Tour' },
    { value: 'boat', label: 'Boat Tour' },
    { value: 'cultural', label: 'Cultural Experience' },
    { value: 'food', label: 'Food Tour' },
    { value: 'adventure', label: 'Adventure Tour' },
    { value: 'custom', label: 'Custom Experience' }
  ];

  const predefinedInterests = [
    'history', 'art', 'food', 'nature', 'architecture', 'music',
    'sports', 'adventure', 'culture', 'photography', 'local life', 'nightlife'
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

  const addTour = () => {
    if (currentTour.title && currentTour.description) {
      setTours(prev => [...prev, { ...currentTour }]);
      setCurrentTour({
        title: '',
        description: '',
        duration: 2,
        price: 50,
        maxParticipants: 8,
        type: 'walking'
      });
    }
  };

  const removeTour = (index: number) => {
    setTours(prev => prev.filter((_, i) => i !== index));
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

    if (tours.length === 0) {
      toast({
        title: "Tour Required",
        description: "Please add at least one tour offering.",
        variant: "destructive"
      });
      return;
    }

    try {
      console.log('Tour Operator form data:', {
        ...formData,
        tours,
        languages,
        interests: [...interests, ...customInterests]
      });

      toast({
        title: "Profile Created!",
        description: "Welcome to Travelogie! Your tour operator profile has been created successfully.",
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
            <Users className="w-6 h-6 text-primary" />
            Create Your Tour Operator Profile
          </CardTitle>
          <CardDescription>
            Share your local expertise and create amazing experiences for travelers
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
                  placeholder="e.g., Barcelona, Spain"
                />
              </div>
            </div>

            {/* Geographic Availability */}
            <div className="space-y-2">
              <Label htmlFor="geographicAvailability">Geographic Area of Tours</Label>
              <Textarea
                id="geographicAvailability"
                value={formData.geographicAvailability}
                onChange={(e) => setFormData(prev => ({ ...prev, geographicAvailability: e.target.value }))}
                placeholder="Describe the areas where you offer tours (e.g., Central Barcelona, Gaudí District, Beach areas...)"
                rows={3}
              />
            </div>

            {/* Tour Offerings */}
            <div className="space-y-4">
              <Label className="text-lg">Tour Offerings *</Label>
              
              {/* Add New Tour */}
              <Card className="border-dashed">
                <CardHeader>
                  <CardTitle className="text-lg">Add New Tour</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Tour Title</Label>
                      <Input
                        value={currentTour.title}
                        onChange={(e) => setCurrentTour(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="e.g., Historic Barcelona Walking Tour"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Tour Type</Label>
                      <Select value={currentTour.type} onValueChange={(value: any) => setCurrentTour(prev => ({ ...prev, type: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {tourTypes.map(type => (
                            <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea
                      value={currentTour.description}
                      onChange={(e) => setCurrentTour(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe your tour experience..."
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Duration (hours)</Label>
                      <Input
                        type="number"
                        min="0.5"
                        step="0.5"
                        value={currentTour.duration}
                        onChange={(e) => setCurrentTour(prev => ({ ...prev, duration: parseFloat(e.target.value) || 2 }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Price (USD)</Label>
                      <Input
                        type="number"
                        min="1"
                        value={currentTour.price}
                        onChange={(e) => setCurrentTour(prev => ({ ...prev, price: parseInt(e.target.value) || 50 }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Max Participants</Label>
                      <Input
                        type="number"
                        min="1"
                        value={currentTour.maxParticipants}
                        onChange={(e) => setCurrentTour(prev => ({ ...prev, maxParticipants: parseInt(e.target.value) || 8 }))}
                      />
                    </div>
                  </div>

                  <Button type="button" onClick={addTour} className="w-full">
                    Add Tour
                  </Button>
                </CardContent>
              </Card>

              {/* Existing Tours */}
              {tours.length > 0 && (
                <div className="space-y-2">
                  <Label>Your Tours</Label>
                  {tours.map((tour, index) => (
                    <Card key={index}>
                      <CardContent className="pt-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-medium">{tour.title}</h4>
                            <p className="text-sm text-muted-foreground">{tour.description}</p>
                            <div className="flex gap-4 text-sm text-muted-foreground mt-2">
                              <span>{tour.duration}h</span>
                              <span>${tour.price}</span>
                              <span>Max {tour.maxParticipants} people</span>
                              <Badge variant="outline">{tour.type}</Badge>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeTour(index)}
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
                    const existingPrimary = languages.find(l => l.fluency === 'native');
                    if (existingPrimary) {
                      setLanguages(prev => prev.map(l => 
                        l.fluency === 'native' 
                          ? { ...l, code: value.split('|')[0], name: value.split('|')[1] }
                          : l
                      ));
                    } else {
                      setLanguages(prev => [...prev, { 
                        code: value.split('|')[0], 
                        name: value.split('|')[1], 
                        fluency: 'native' 
                      }]);
                    }
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
                      if (!languages.find(l => l.code === code)) {
                        setLanguages(prev => [...prev, { code, name, fluency: 'conversational' }]);
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
                    {languages.filter(lang => lang.fluency !== 'native').map((lang, index) => (
                      <Badge key={index} variant="outline" className="flex items-center gap-1">
                        {lang.name} ({lang.fluency})
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-auto p-0 ml-1"
                          onClick={() => setLanguages(prev => prev.filter(l => l.code !== lang.code))}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Tour Specialties/Interests */}
            <div className="space-y-4">
              <Label>Tour Specialties</Label>
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
                placeholder="Tell travelers about your experience, passion for your city, and what makes your tours special..."
                rows={4}
              />
            </div>

            <Button type="submit" className="w-full" size="lg">
              Create Tour Operator Profile
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default TourOperatorForm;
