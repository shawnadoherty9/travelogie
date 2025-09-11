import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Heart, MessageCircle, Star } from "lucide-react";

const TravelExperiencesShowcase = () => {
  const experiences = [
    {
      id: 1,
      location: "Kyoto, Japan",
      title: "Hidden Temple Discovery",
      author: "Sakura T.",
      image: "/src/assets/japanese-tea-ceremony.jpg",
      rating: 4.9,
      likes: 127,
      comments: 23,
      description: "Found this incredible hidden temple where monks still practice ancient tea ceremonies. The experience was magical!",
      tags: ["Culture", "Spiritual", "Photography"],
      date: "2 days ago"
    },
    {
      id: 2,
      location: "Barcelona, Spain",
      title: "Secret Rooftop Markets",
      author: "Carlos M.",
      image: "/src/assets/barcelona-arts-scene.jpg",
      rating: 4.7,
      likes: 89,
      comments: 15,
      description: "Local vendors sell handmade crafts every Sunday on this hidden rooftop. Amazing views of Sagrada Familia!",
      tags: ["Markets", "Local", "Views"],
      date: "1 week ago"
    },
    {
      id: 3,
      location: "Varanasi, India",
      title: "Dawn River Meditation",
      author: "Priya S.",
      image: "/src/assets/varanasi-temples.jpg",
      rating: 5.0,
      likes: 203,
      comments: 31,
      description: "Join local yogis for sunrise meditation by the Ganges. Life-changing experience that connects you with the city's soul.",
      tags: ["Spiritual", "Wellness", "Sunrise"],
      date: "3 days ago"
    }
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-background via-background/80 to-primary/5">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Travel Stories from Locals
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover authentic experiences shared by fellow travelers and locals. 
            Get insider tips and create your own travel memories.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {experiences.map((experience) => (
            <Card 
              key={experience.id} 
              className="group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl bg-card/80 backdrop-blur-sm border-border/50"
            >
              <div className="relative overflow-hidden rounded-t-lg">
                <img
                  src={experience.image}
                  alt={experience.title}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4">
                  <Badge variant="secondary" className="bg-background/90 text-foreground">
                    <MapPin className="w-3 h-3 mr-1" />
                    {experience.location}
                  </Badge>
                </div>
                <div className="absolute top-4 right-4 flex gap-2">
                  {experience.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="outline" className="bg-background/90 text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{experience.rating}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{experience.date}</span>
                </div>
                
                <h3 className="font-bold text-lg mb-2 text-foreground group-hover:text-primary transition-colors">
                  {experience.title}
                </h3>
                
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  {experience.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Heart className="w-4 h-4" />
                      {experience.likes}
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4" />
                      {experience.comments}
                    </div>
                  </div>
                  <span className="text-xs font-medium text-primary">
                    by {experience.author}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3"
          >
            Share Your Experience
          </Button>
          <p className="text-sm text-muted-foreground mt-3">
            Join our community of travelers and locals sharing authentic experiences
          </p>
        </div>
      </div>
    </section>
  );
};

export default TravelExperiencesShowcase;