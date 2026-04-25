import HomeNavbar from '../components/home/HomeNavbar'
import HeroSection from '../components/home/HeroSection';
import FeaturesSection from '../components/home/FeatureSection';
import SupportedFormatsSection from '../components/home/SupportedFormatsSection';
import SupportedModelsSection from '../components/home/SupportedModelsSection';
import Footer from '../components/home/Footer';

const generalChatModels = [
  {
    type: 'normal',
    name: 'Nemotron 3 Super 120B',
    provider: 'NVIDIA',
    useCase: 'Balanced quality for everyday questions in General Chat',
    modelId: 'nvidia/nemotron-3-super-120b-a12b:free',
    logo: '/nvidia-color.svg',
  },
  {
    type: 'fast',
    name: 'GPT-OSS 120B',
    provider: 'OpenAI',
    useCase: 'Lower-latency replies for quick prompts in General Chat',
    modelId: 'openai/gpt-oss-120b:free',
    logo: '/openai.svg',
  },
];

const Home = () => {
  return (
    <div className='min-h-screen bg-slate-50 font-home'>
      <HomeNavbar />
      <HeroSection />
      <SupportedFormatsSection />
      <SupportedModelsSection generalChatModels={generalChatModels} />
      <FeaturesSection />
      <Footer />
    </div>
  );
};

export default Home;