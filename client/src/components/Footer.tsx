import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#FFE600] text-gray-900 py-10 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <img 
              src="https://blog.clubedeautores.com.br/wp-content/uploads/2022/07/Mercado-Livre-logo-1.png"
              alt="Mercado Livre Logo" 
              className="h-10 mb-2 mx-auto md:mx-0"
            />
            <p className="text-sm text-center md:text-left font-medium">© 2024 Mercado Livre. Todos os direitos reservados.</p>
          </div>
          
          <div className="text-center md:text-right">
            <p className="text-sm opacity-80 mb-2 font-medium">Programa de Parceiros Entregadores Mercado Livre</p>
            <p className="text-xs opacity-70">Trabalhe conosco e faça parte da nossa equipe de entregas</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;