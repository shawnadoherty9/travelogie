import Header from "@/components/layout/Header";
import HeroSection from "@/components/home/HeroSection";
import UserTypeSelection from "@/components/home/UserTypeSelection";
import ExperienceShowcase from "@/components/home/ExperienceShowcase";
import InteractiveTravelMap from "@/components/home/InteractiveTravelMap";
import TravelExperiencesShowcase from "@/components/home/TravelExperiencesShowcase";
import Footer from "@/components/home/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <UserTypeSelection />
        <TravelExperiencesShowcase />
        <ExperienceShowcase />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
