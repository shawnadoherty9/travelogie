import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, MapPin, Languages, CheckCircle, Clock, Play, ChevronDown } from "lucide-react";

// Import background image
import languageInstructorsBackground from "@/assets/language-instructors-background.jpg";

interface LanguageInstructor {
  id: number;
  name: string;
  avatar: string;
  rating: number;
  reviews: number;
  location: string;
  languages: string[];
  expertise: string;
  specializations: string[];
  interests: string[];
  hourlyRate: string;
  experience: string;
  verified: boolean;
  about: string;
}

interface SampleLesson {
  id: number;
  title: string;
  language: string;
  level: string;
  duration: string;
  instructor: string;
  image: string;
  vocabulary: string[];
  phrases: string[];
  culturalNotes: string;
}

interface LanguageInstructorsSectionProps {
  instructors: LanguageInstructor[];
  sampleLessons: SampleLesson[];
  selectedLanguage: string;
  onLanguageSelect: (language: string) => void;
  languages: string[];
}

const INITIAL_LESSON_COUNT = 5;

export const LanguageInstructorsSection = ({
  instructors,
  sampleLessons,
  selectedLanguage,
  onLanguageSelect,
  languages
}: LanguageInstructorsSectionProps) => {
  const [showAll, setShowAll] = useState(false);

  const filteredLessons = useMemo(() => 
    sampleLessons.filter(lesson => selectedLanguage === "" || lesson.language === selectedLanguage),
    [sampleLessons, selectedLanguage]
  );

  const visibleLessons = showAll ? filteredLessons : filteredLessons.slice(0, INITIAL_LESSON_COUNT);
  const hasMore = filteredLessons.length > INITIAL_LESSON_COUNT;
  return (
    <section 
      className="py-16 relative overflow-hidden text-white"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${languageInstructorsBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Learn Languages with Native Speakers
          </h2>
          <p className="text-lg opacity-90 max-w-3xl mx-auto">
            Master local languages through cultural immersion with passionate native speakers 
            who blend language learning with authentic cultural experiences.
          </p>
        </div>

        {/* Language Instructors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-12">
          {instructors.map((instructor) => (
            <Card key={instructor.id} className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300">
              <div className="p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={instructor.avatar} alt={instructor.name} />
                    <AvatarFallback className="bg-gradient-to-br from-travel-ocean to-travel-sky text-white">
                      {instructor.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white flex items-center gap-1">
                      {instructor.name}
                      {instructor.verified && <CheckCircle className="w-4 h-4 text-travel-forest" />}
                    </h3>
                    <div className="flex items-center gap-1 text-white/70 text-sm">
                      <MapPin className="w-3 h-3" />
                      {instructor.location}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 fill-travel-sunset text-travel-sunset" />
                    <span className="text-white font-medium">{instructor.rating}</span>
                    <span className="text-white/70 text-sm">({instructor.reviews})</span>
                  </div>
                  
                  <div className="text-sm text-white/90 font-medium">
                    {instructor.expertise}
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {instructor.languages.map((lang, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs bg-white/20 text-white border-white/30">
                        {lang}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="text-travel-sunset font-medium">
                    {instructor.hourlyRate}
                  </div>
                </div>
                
                <Button size="sm" className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30">
                  Book Lesson
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Sample Lessons */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <h3 className="text-2xl font-bold mb-6 text-center">Sample Cultural Language Lessons</h3>
          
          {/* Language Filter */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            <Button
              variant={selectedLanguage === "" ? "default" : "outline"}
              size="sm"
              onClick={() => { onLanguageSelect(""); setShowAll(false); }}
              className={selectedLanguage === "" ? "bg-white text-black" : "bg-white/20 text-white border-white/30 hover:bg-white/30"}
            >
              All Languages
            </Button>
            {languages.map((lang) => (
              <Button
                key={lang}
                variant={selectedLanguage === lang ? "default" : "outline"}
                size="sm"
                onClick={() => { onLanguageSelect(lang); setShowAll(false); }}
                className={selectedLanguage === lang ? "bg-white text-black" : "bg-white/20 text-white border-white/30 hover:bg-white/30"}
              >
                {lang}
              </Button>
            ))}
          </div>
          
          {/* Lessons Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleLessons.map((lesson) => (
                <Card key={lesson.id} className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300">
                  <div className="aspect-video relative overflow-hidden rounded-t-lg bg-gradient-to-br from-primary/30 to-accent/30">
                    <img 
                      src={lesson.image} 
                      alt={lesson.title}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                      <Play className="w-12 h-12 text-white" />
                    </div>
                    <Badge className="absolute top-2 left-2 bg-travel-sunset text-white">
                      {lesson.language}
                    </Badge>
                    <Badge className="absolute top-2 right-2 bg-travel-ocean text-white">
                      {lesson.level}
                    </Badge>
                  </div>
                  
                  <CardContent className="p-4 space-y-3">
                    <div>
                      <h4 className="font-semibold text-white">{lesson.title}</h4>
                      <div className="flex items-center gap-2 text-white/70 text-sm">
                        <Clock className="w-4 h-4" />
                        {lesson.duration} with {lesson.instructor}
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-travel-sunset font-medium">Key Vocabulary: </span>
                        <span className="text-white/90">{lesson.vocabulary.slice(0, 3).join(', ')}...</span>
                      </div>
                      
                      <div className="bg-white/10 p-3 rounded">
                        <span className="text-travel-forest font-medium">Cultural Note: </span>
                        <span className="text-white/90 text-xs">{lesson.culturalNotes}</span>
                      </div>
                    </div>
                    
                    <Button size="sm" className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30">
                      Try This Lesson
                    </Button>
                  </CardContent>
                </Card>
              ))}
          </div>

          {/* Show More / Show Less */}
          {hasMore && !showAll && (
            <div className="text-center mt-8">
              <Button
                onClick={() => setShowAll(true)}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30 gap-2"
                variant="outline"
              >
                Show More Lessons ({filteredLessons.length - INITIAL_LESSON_COUNT} more)
                <ChevronDown className="w-4 h-4" />
              </Button>
            </div>
          )}
          {showAll && hasMore && (
            <div className="text-center mt-8">
              <Button
                onClick={() => setShowAll(false)}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30 gap-2"
                variant="outline"
              >
                Show Less
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};