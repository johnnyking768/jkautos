import { useEffect } from "react";
import Aos from "aos";
import "aos/dist/aos.css";
import HeroSection from "../components/sections/HeroSection";
import BrandShowcase from "../components/sections/BrandShowcase";
import FeaturedCars from "../components/sections/FeaturedCars";
import WhyChooseUs from "../components/sections/WhyChooseUs";
import HowItWorks from "../components/sections/HowItWorks";
import StatsSection from "../components/sections/StatsSection";
import BodyTypeSection from "../components/sections/BodyTypeSection";
import TestimonialsSection from "../components/sections/TestimonialsSection";
import InstallmentSection from "../components/sections/InstallmentSection";
import CTASection from "../components/sections/CTASection";
import NewsletterSection from "../components/sections/NewsletterSection";

export default function LandingPage() {
  useEffect(() => {
    document.title = "JK Autos | Premium Car Dealership Nigeria";
    Aos.init({ duration: 650, once: true, offset: 80 });
  }, []);

  return (
    <>
      <HeroSection />
      <div data-aos="fade-up"><BrandShowcase /></div>
      <div data-aos="fade-up"><FeaturedCars /></div>
      <StatsSection />
      <div data-aos="fade-up"><WhyChooseUs /></div>
      <div data-aos="fade-up"><HowItWorks /></div>
      <div data-aos="fade-up"><BodyTypeSection /></div>
      <div data-aos="fade-up"><InstallmentSection /></div>
      <div data-aos="fade-up"><TestimonialsSection /></div>
      <CTASection />
      <NewsletterSection />
    </>
  );
}
