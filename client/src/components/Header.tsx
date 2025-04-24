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
        <button className="nav-header-menu-switch" aria-label="Menu do usuário" aria-expanded="false" disabled style={{
          background: "none",
          border: "none",
          padding: "0",
          width: "24px",
          height: "24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "default"
        }}>
          <span style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%"
          }}>
            <span className="hamburger-top-bread" style={{
              display: "block",
              width: "16px",
              height: "3px",
              backgroundColor: "#303674",
              marginBottom: "4px"
            }}></span>
            <span className="hamburger-patty" style={{
              display: "block",
              width: "20px",
              height: "3px",
              backgroundColor: "#303674",
              marginBottom: "4px"
            }}></span>
            <span className="hamburger-bottom-bread" style={{
              display: "block",
              width: "24px",
              height: "3px",
              backgroundColor: "#303674"
            }}></span>
          </span>
        </button>
      </div>
    </header>
  );
};

export default Header;