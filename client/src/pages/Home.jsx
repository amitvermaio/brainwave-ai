import HomeNavbar from '../components/home/HomeNavbar'
import HeroSection from '../components/home/HeroSection';
import FeaturesSection from '../components/home/FeatureSection';
import SupportedFormatsSection from '../components/home/SupportedFormatsSection';
import SupportedModelsSection from '../components/home/SupportedModelsSection';
import Footer from '../components/home/Footer';

const Home = () => {
  return (
    <div className='min-h-screen bg-slate-50 font-home'>
      <HomeNavbar />
      <HeroSection />
      <SupportedFormatsSection />
      <SupportedModelsSection />
      <FeaturesSection />
      <Footer />
    </div>
  );
};

export default Home;