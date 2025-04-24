import React from 'react';

const PageTitle: React.FC = () => {
  return (
    <div className="w-full bg-[#FFE602] py-1 px-6 flex items-center relative overflow-hidden border-t border-[#272F76]">
      {/* Bola amarela decorativa no canto direito */}
      <div className="absolute right-0 top-0 bottom-0 w-32 h-full rounded-l-full bg-[#FFD100]"></div>

      {/* Conteúdo principal do título */}
      <div className="flex items-center relative z-10">
        <div className="text-[#303674] mr-3">
          <i className="fas fa-chevron-right text-3xl font-black" style={{ color: '#303674' }}></i>
        </div>
        <div className="leading-none">
          <h1 className="text-base font-bold text-[#303674] mb-0">Motorista Parceiro</h1>
          <p className="text-[#303674] text-sm mt-0" style={{ transform: 'translateY(-2px)' }}>
            Mercado Livre
          </p>
        </div>
      </div>
    </div>
  );
};

export default PageTitle;

