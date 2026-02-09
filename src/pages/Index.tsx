import Header from "@/components/layout/Header";
import HeroSection from "@/components/home/HeroSection";
import UserTypeSelection from "@/components/home/UserTypeSelection";
import ExperienceShowcase from "@/components/home/ExperienceShowcase";
import InteractiveTravelMap from "@/components/home/InteractiveTravelMap";
import TravelExperiencesShowcase from "@/components/home/TravelExperiencesShowcase";
import Footer from "@/components/home/Footer";
import { LiveEventsSection } from "@/components/events/LiveEventsSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <UserTypeSelection />
        <TravelExperiencesShowcase />
        <LiveEventsSection title="Upcoming Events Around the World" limit={6} />
        <ExperienceShowcase />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
