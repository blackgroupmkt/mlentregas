import React from 'react';
import { Link } from 'wouter';

const Header: React.FC = () => {
  return (
    <header className="bg-[#FFE602] shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/">
          <img 
            src="https://i.ibb.co/GY7bV47/Inserir-um-ti-tulo-3-1-1.webp" 
            alt="Mercado Livre Logo" 
            className="h-8 cursor-pointer"
          />
        </Link>
        <div className="hamburger-menu cursor-pointer">
          <div className="hamburger-line w-[16px] h-[3px] bg-[#303674] my-1 transition-all duration-400"></div>
          <div className="hamburger-line w-[20px] h-[3px] bg-[#303674] my-1 transition-all duration-400"></div>
          <div className="hamburger-line w-[24px] h-[3px] bg-[#303674] my-1 transition-all duration-400"></div>
        </div>
      </div>
    </header>
  );
};

export default Header;