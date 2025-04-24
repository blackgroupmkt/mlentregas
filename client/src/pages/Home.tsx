import React, { useEffect } from 'react';
import Header from '@/components/Header';
import PageTitle from '@/components/PageTitle';
import HeroSection from '@/components/HeroSection';
import Carousel from '@/components/Carousel';
import InfoSection from '@/components/InfoSection';
import JobOpeningsSection from '@/components/JobOpeningsSection';
import BenefitsSection from '@/components/BenefitsSection';
import FAQSection from '@/components/FAQSection';
import CTASection from '@/components/CTASection';
import Footer from '@/components/Footer';
import CepModal from '@/components/CepModal';
import { useAppContext } from '@/contexts/AppContext';

const Home: React.FC = () => {
  const { 
    showCepModal, 
    setShowCepModal, 
    setCepData, 
    setUserCheckedCep 
  } = useAppContext();
  
  useEffect(() => {
    // Sempre mostrar o modal de CEP na página inicial
    setShowCepModal(true);
    
    // Verificar se já temos dados salvos
    const savedCepData = localStorage.getItem('shopee_delivery_cep_data');
    if (savedCepData) {
      try {
        const parsedData = JSON.parse(savedCepData);
        setCepData(parsedData);
        setUserCheckedCep(true);
        // Não escondemos o modal aqui, para que ele sempre apareça na página inicial
      } catch (error) {
        console.error('Erro ao carregar dados de CEP do localStorage:', error);
        localStorage.removeItem('shopee_delivery_cep_data');
      }
    }
  }, []);
  
  const handleCepConfirm = (cepData: { cep: string, city: string, state: string }) => {
    setCepData(cepData);
    setUserCheckedCep(true);
    setShowCepModal(false);
  };
  
  const handleCepModalClose = () => {
    // Permitir fechar apenas se já temos dados de CEP
    const savedCepData = localStorage.getItem('shopee_delivery_cep_data');
    if (savedCepData) {
      setShowCepModal(false);
    }
  };

  return (
    <div className="bg-white">
      <CepModal 
        isOpen={showCepModal} 
        onClose={handleCepModalClose}
        onConfirm={handleCepConfirm}
      />
      <Header />
      <PageTitle />
      <HeroSection />
      <Carousel />
      <InfoSection />
      <JobOpeningsSection />
      <BenefitsSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </div>
  );
};

export default Home;
