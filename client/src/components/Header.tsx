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
        <button 
          className="nav-header-menu-switch" 
          aria-label="Menu do usuário" 
          aria-expanded="false" 
          disabled 
          style={{
            background: "#FFE602",
            border: "none",
            padding: "8px 10px",
            width: "40px",
            height: "40px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            cursor: "default",
            gap: "4px",
            boxSizing: "border-box"
          }}
        >
          <span className="hamburger-top-bread" style={{
            display: "block",
            width: "20px",
            height: "2px",
            backgroundColor: "#303674"
          }}></span>
          <span className="hamburger-patty" style={{
            display: "block",
            width: "20px",
            height: "2px",
            backgroundColor: "#303674"
          }}></span>
          <span className="hamburger-bottom-bread" style={{
            display: "block",
            width: "20px",
            height: "2px",
            backgroundColor: "#303674"
          }}></span>
        </button>
      </div>
    </header>
  );
};

export default Header;