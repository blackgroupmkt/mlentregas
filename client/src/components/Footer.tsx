import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#303674] text-white py-10 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-6 md:mb-0">
            <img 
              src="https://upload.wikimedia.org/wikipedia/pt/0/04/Logotipo_MercadoLivre.png"
              alt="Mercado Livre Logo" 
              className="h-10 mb-2 mx-auto md:mx-0 bg-white p-1 rounded"
            />
            <p className="text-sm text-center md:text-left">© 2024 Mercado Livre. Todos os direitos reservados.</p>
          </div>
          
          <div className="text-center md:text-right">
            <p className="text-sm opacity-80 mb-2">Programa de Parceiros Entregadores Mercado Livre</p>
            <p className="text-xs opacity-70">Trabalhe conosco e faça parte da nossa equipe de entregas</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;