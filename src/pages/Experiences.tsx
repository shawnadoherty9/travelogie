import FilterableExperienceShowcase from "@/components/experiences/FilterableExperienceShowcase";
import Header from "@/components/layout/Header";
import Footer from "@/components/home/Footer";

const Experiences = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="py-12">
          <div className="container mx-auto px-4 text-center space-y-4 mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              Magical Experiences
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Discover authentic cultural adventures led by passionate locals around the world
            </p>
          </div>
        </div>
        <FilterableExperienceShowcase />
      </main>
      <Footer />
    </div>
  );
};

export default Experiences;