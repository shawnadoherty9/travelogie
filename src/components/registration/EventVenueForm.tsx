import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Upload, X, Plus, Calendar, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface VenueSpace {
  name: string;
  description: string;
  capacity: number;
  amenities: string[];
  pricePerHour: number;
  pricePerDay: number;
  spaceType: string;
}

const EventVenueForm: React.FC = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    birthdate: '',
    homeCity: '',
    venueName: '',
    venueAddress: '',
    venueDescription: '',
    bio: '',
    profileImage: null as File | null,
    businessLicense: '',
    insuranceDetails: ''
  });

  const [venueSpaces, setVenueSpaces] = useState<VenueSpace[]>([]);
  const [currentSpace, setCurrentSpace] = useState<VenueSpace>({
    name: '',
    description: '',
    capacity: 50,
    amenities: [],
    pricePerHour: 100,
    pricePerDay: 800,
    spaceType: ''
  });

  const [spokenLanguages, setSpokenLanguages] = useState<Array<{code: string, name: string, fluency: string}>>([]);
  const [eventTypes, setEventTypes] = useState<string[]>([]);
  const [customEventTypes, setCustomEventTypes] = useState<string[]>([]);
  const [newCustomEventType, setNewCustomEventType] = useState('');

  const spaceTypes = [
    'Conference Room',
    'Event Hall',
    'Outdoor Garden',
    'Rooftop Terrace',
    'Art Gallery',
    'Theater Space',
    'Workshop Studio',
    'Cultural Center',
    'Community Hall',
    'Private Dining Room'
  ];

  const availableAmenities = [
    'Audio/Video Equipment',
    'Wi-Fi',
    'Catering Kitchen',
    'Parking',
    'Wheelchair Accessible',
    'Air Conditioning',
    'Natural Light',
    'Stage/Platform',
    'Dance Floor',
    'Bar Service',
    'Security System',
    'Outdoor Space',
    'Restrooms',
    'Storage Space',
    'Loading Dock'
  ];

  const predefinedEventTypes = [
    'cultural festivals', 'art exhibitions', 'music concerts', 'dance performances',
    'workshops', 'conferences', 'weddings', 'community gatherings',
    'language exchanges', 'food festivals', 'markets', 'networking events'
  ];

  const handleAmenityToggle = (amenity: string) => {
    setCurrentSpace(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  const handleEventTypeToggle = (eventType: string) => {
    setEventTypes(prev => 
      prev.includes(eventType) 
        ? prev.filter(e => e !== eventType)
        : [...prev, eventType]
    );
  };

  const addCustomEventType = () => {
    if (newCustomEventType.trim() && !customEventTypes.includes(newCustomEventType.trim())) {
      setCustomEventTypes(prev => [...prev, newCustomEventType.trim()]);
      setNewCustomEventType('');
    }
  };

  const addVenueSpace = () => {
    if (currentSpace.name && currentSpace.description && currentSpace.spaceType) {
      setVenueSpaces(prev => [...prev, { ...currentSpace }]);
      setCurrentSpace({
        name: '',
        description: '',
        capacity: 50,
        amenities: [],
        pricePerHour: 100,
        pricePerDay: 800,
        spaceType: ''
      });
    }
  };

  const removeVenueSpace = (index: number) => {
    setVenueSpaces(prev => prev.filter((_, i) => i !== index));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ ...prev, profileImage: file }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.birthdate || !formData.venueName) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    if (venueSpaces.length === 0) {
      toast({
        title: "Space Required",
        description: "Please add at least one venue space.",
        variant: "destructive"
      });
      return;
    }

    try {
      console.log('Event Venue form data:', {
        ...formData,
        venueSpaces,
        spokenLanguages,
        eventTypes: [...eventTypes, ...customEventTypes]
      });

      toast({
        title: "Profile Created!",
        description: "Welcome to Travelogie! Your event venue profile has been created successfully.",
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
            <Calendar className="w-6 h-6 text-primary" />
            Create Your Event Venue Profile
          </CardTitle>
          <CardDescription>
            Share your space and host memorable cultural events for the community
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Profile Image Upload */}
            <div className="space-y-2">
              <Label>Venue Photo</Label>
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 border-2 border-dashed border-muted-foreground rounded-lg flex items-center justify-center">
                  {formData.profileImage ? (
                    <img 
                      src={URL.createObjectURL(formData.profileImage)} 
                      alt="Venue" 
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

            {/* Personal Information */}
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
                <Label htmlFor="homeCity">City</Label>
                <Input
                  id="homeCity"
                  value={formData.homeCity}
                  onChange={(e) => setFormData(prev => ({ ...prev, homeCity: e.target.value }))}
                  placeholder="e.g., Austin, Texas"
                />
              </div>
            </div>

            {/* Venue Information */}
            <div className="space-y-4">
              <Label className="text-lg">Venue Information</Label>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="venueName">Venue Name *</Label>
                  <Input
                    id="venueName"
                    value={formData.venueName}
                    onChange={(e) => setFormData(prev => ({ ...prev, venueName: e.target.value }))}
                    placeholder="e.g., Cultural Arts Center"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="venueAddress">Venue Address</Label>
                  <Input
                    id="venueAddress"
                    value={formData.venueAddress}
                    onChange={(e) => setFormData(prev => ({ ...prev, venueAddress: e.target.value }))}
                    placeholder="Full address"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="venueDescription">Venue Description</Label>
                <Textarea
                  id="venueDescription"
                  value={formData.venueDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, venueDescription: e.target.value }))}
                  placeholder="Describe your venue, its history, atmosphere, and what makes it special..."
                  rows={3}
                />
              </div>
            </div>

            {/* Business Information */}
            <div className="space-y-4">
              <Label className="text-lg">Business Information</Label>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="businessLicense">Business License Number</Label>
                  <Input
                    id="businessLicense"
                    value={formData.businessLicense}
                    onChange={(e) => setFormData(prev => ({ ...prev, businessLicense: e.target.value }))}
                    placeholder="Optional business license"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="insuranceDetails">Insurance Details</Label>
                  <Input
                    id="insuranceDetails"
                    value={formData.insuranceDetails}
                    onChange={(e) => setFormData(prev => ({ ...prev, insuranceDetails: e.target.value }))}
                    placeholder="Insurance provider and policy info"
                  />
                </div>
              </div>
            </div>

            {/* Venue Spaces */}
            <div className="space-y-4">
              <Label className="text-lg">Venue Spaces *</Label>
              
              {/* Add New Space */}
              <Card className="border-dashed">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    Add Venue Space
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Space Name</Label>
                      <Input
                        value={currentSpace.name}
                        onChange={(e) => setCurrentSpace(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g., Main Event Hall"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Space Type</Label>
                      <Select value={currentSpace.spaceType} onValueChange={(value) => setCurrentSpace(prev => ({ ...prev, spaceType: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select space type" />
                        </SelectTrigger>
                        <SelectContent>
                          {spaceTypes.map(type => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Space Description</Label>
                    <Textarea
                      value={currentSpace.description}
                      onChange={(e) => setCurrentSpace(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe the space, its features, and ideal uses..."
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label>Capacity (people)</Label>
                      <Input
                        type="number"
                        min="1"
                        value={currentSpace.capacity}
                        onChange={(e) => setCurrentSpace(prev => ({ ...prev, capacity: parseInt(e.target.value) || 50 }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Price per Hour (USD)</Label>
                      <Input
                        type="number"
                        min="1"
                        value={currentSpace.pricePerHour}
                        onChange={(e) => setCurrentSpace(prev => ({ ...prev, pricePerHour: parseInt(e.target.value) || 100 }))}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Price per Day (USD)</Label>
                      <Input
                        type="number"
                        min="1"
                        value={currentSpace.pricePerDay}
                        onChange={(e) => setCurrentSpace(prev => ({ ...prev, pricePerDay: parseInt(e.target.value) || 800 }))}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Amenities</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {availableAmenities.map(amenity => (
                        <div key={amenity} className="flex items-center space-x-2">
                          <Checkbox
                            id={amenity}
                            checked={currentSpace.amenities.includes(amenity)}
                            onCheckedChange={() => handleAmenityToggle(amenity)}
                          />
                          <Label htmlFor={amenity} className="text-sm">
                            {amenity}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button type="button" onClick={addVenueSpace} className="w-full">
                    Add Venue Space
                  </Button>
                </CardContent>
              </Card>

              {/* Existing Spaces */}
              {venueSpaces.length > 0 && (
                <div className="space-y-2">
                  <Label>Your Venue Spaces</Label>
                  {venueSpaces.map((space, index) => (
                    <Card key={index}>
                      <CardContent className="pt-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-medium">{space.name}</h4>
                            <p className="text-sm text-muted-foreground">{space.description}</p>
                            <div className="flex gap-4 text-sm text-muted-foreground mt-2 flex-wrap">
                              <span>Capacity: {space.capacity}</span>
                              <span>${space.pricePerHour}/hour</span>
                              <span>${space.pricePerDay}/day</span>
                              <Badge variant="outline">{space.spaceType}</Badge>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {space.amenities.slice(0, 3).map(amenity => (
                                <Badge key={amenity} variant="secondary" className="text-xs">{amenity}</Badge>
                              ))}
                              {space.amenities.length > 3 && (
                                <Badge variant="secondary" className="text-xs">+{space.amenities.length - 3} more</Badge>
                              )}
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeVenueSpace(index)}
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

            {/* Event Types */}
            <div className="space-y-4">
              <Label>Types of Events You Host</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {predefinedEventTypes.map(eventType => (
                  <div key={eventType} className="flex items-center space-x-2">
                    <Checkbox
                      id={eventType}
                      checked={eventTypes.includes(eventType)}
                      onCheckedChange={() => handleEventTypeToggle(eventType)}
                    />
                    <Label htmlFor={eventType} className="text-sm capitalize">
                      {eventType}
                    </Label>
                  </div>
                ))}
              </div>
              
              <div className="space-y-2">
                <Label>Custom Event Types</Label>
                <div className="flex gap-2">
                  <Input
                    value={newCustomEventType}
                    onChange={(e) => setNewCustomEventType(e.target.value)}
                    placeholder="Add custom event type"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomEventType())}
                  />
                  <Button type="button" onClick={addCustomEventType} size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {customEventTypes.map((eventType, index) => (
                    <Badge key={index} variant="outline">
                      {eventType}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="ml-1 h-auto p-0"
                        onClick={() => setCustomEventTypes(prev => prev.filter(e => e !== eventType))}
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
              <Label htmlFor="bio">About You & Your Venue</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="Tell event organizers about your passion for hosting events, your venue's story, and what makes it special for cultural gatherings..."
                rows={4}
              />
            </div>

            <Button type="submit" className="w-full" size="lg">
              Create Event Venue Profile
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EventVenueForm;
