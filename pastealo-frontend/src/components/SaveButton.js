import React from 'react';

const SaveButton = ({ handleGuardar }) => {
  return (
    <div className="d-grid">
      <button className="btn btn-warning" onClick={handleGuardar}>Guardar</button>
    </div>
  );
};

export default SaveButton;