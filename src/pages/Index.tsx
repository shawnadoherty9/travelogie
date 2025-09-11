import Header from "@/components/layout/Header";
import HeroSection from "@/components/home/HeroSection";
import UserTypeSelection from "@/components/home/UserTypeSelection";
import ExperienceShowcase from "@/components/home/ExperienceShowcase";
import InteractiveMap from "@/components/home/InteractiveMap";
import TravelExperiencesShowcase from "@/components/home/TravelExperiencesShowcase";
import Footer from "@/components/home/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <UserTypeSelection />
        <InteractiveMap />
        <TravelExperiencesShowcase />
        <ExperienceShowcase />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
