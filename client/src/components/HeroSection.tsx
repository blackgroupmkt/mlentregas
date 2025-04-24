import React from 'react';

const HeroSection: React.FC = () => {
  return (
    <section className="bg-mercadolivre relative overflow-hidden">
      {/* Banner do Mercado Livre */}
      <div className="w-full flex justify-center">
        <img 
          src="https://i.ibb.co/6c08QGz8/Inserir-um-ti-tulo.webp" 
          alt="Banner Entregador Mercado Livre" 
          className="w-full max-w-7xl object-cover" 
        />
      </div>
    </section>
  );
};

export default HeroSection;
