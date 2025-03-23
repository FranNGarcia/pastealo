import React from 'react';

const Header = () => {
  return (
    <div className="d-flex align-items-center mb-4">
      <img 
        src={`${process.env.PUBLIC_URL}/favicon-96x96.png`}
        alt="Pastealo Logo" 
        height="30" 
        className="me-2" 
      />
      <h4 className="mb-0 text-warning">Pastealo</h4>
    </div>
  );
};

export default Header;