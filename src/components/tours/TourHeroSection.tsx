import toursHeroBackground from "@/assets/tours-hero-background.jpg";

interface TourHeroSectionProps {
  title?: string;
  subtitle?: string;
}

export const TourHeroSection = ({ 
  title = "Learn with Locals",
  subtitle = "Connect with passionate local guides for authentic cultural experiences"
}: TourHeroSectionProps) => {
  return (
    <section 
      className="py-16 bg-gradient-wanderlust text-white relative overflow-hidden" 
      style={{
        backgroundImage: `linear-gradient(rgba(32, 130, 180, 0.8), rgba(220, 95, 75, 0.8)), url(${toursHeroBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="container mx-auto px-4 text-center relative z-10">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          {title}
        </h1>
        <p className="text-xl md:text-2xl mb-8 opacity-90">
          {subtitle}
        </p>
      </div>
    </section>
  );
};