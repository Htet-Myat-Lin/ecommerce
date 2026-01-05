import { Header } from '../components/header/Header';
import { LoginModal } from '../components/modal/LoginModal';
import { RegisterModal } from '../components/modal/RegisterModal';
import FeatureProducts from '../components/ui/FeatureProducts';
import { HeroSection } from '../components/ui/Hero';

const Home = () => {
  return (
    <div>
      <Header />
      <HeroSection />
      <FeatureProducts />
      <LoginModal />
      <RegisterModal />
    </div>
  )
}

export default Home
