import FilterableExperienceShowcase from "@/components/experiences/FilterableExperienceShowcase";
import Header from "@/components/layout/Header";
import Footer from "@/components/home/Footer";

// Import background image
import varanasiBackground from "@/assets/varanasi-experiences-background.jpg";

const Experiences = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        {/* Hero Section with Varanasi Background */}
        <section 
          className="py-20 bg-gradient-wanderlust text-white relative overflow-hidden"
          style={{
            backgroundImage: `linear-gradient(rgba(32, 130, 180, 0.7), rgba(220, 95, 75, 0.7)), url(${varanasiBackground})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <div className="container mx-auto px-4 text-center space-y-4 relative z-10">
            <h1 className="text-4xl md:text-6xl font-bold text-white">
              Magical Experiences
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
              Discover authentic cultural adventures led by passionate locals around the world
            </p>
          </div>
        </section>
        <FilterableExperienceShowcase />
      </main>
      <Footer />
    </div>
  );
};

export default Experiences;