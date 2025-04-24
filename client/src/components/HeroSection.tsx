import React from 'react';

const HeroSection: React.FC = () => {
  return (
    <section className="bg-mercadolivre relative overflow-hidden">
      {/* Poderia ser substituído por uma imagem específica do Mercado Livre quando disponível */}
      <div className="py-16 px-6 md:py-24 md:px-12 flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl md:text-5xl font-bold text-mercadolivre-secondary mb-6">Seja um Entregador Parceiro Mercado Livre</h1>
        <p className="text-xl md:text-2xl text-mercadolivre-secondary mb-8 max-w-3xl">Trabalhe com liberdade, faça seu próprio horário e aumente sua renda entregando para o maior marketplace da América Latina</p>
        <div className="bg-mercadolivre-secondary text-white font-bold py-3 px-8 rounded-lg text-lg shadow-lg hover:bg-opacity-90 transition-all">
          Cadastre-se agora
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
