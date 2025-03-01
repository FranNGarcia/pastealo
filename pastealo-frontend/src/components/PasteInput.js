import React from 'react';

const PasteInput = ({ keyId, setKeyId, handleBuscar }) => {
  return (
    <div className="mb-3">
      <label htmlFor="keyId" className="form-label">Key del paste:</label>
      <div className="input-group">
        <input
          type="text"
          id="keyId"
          className="form-control bg-dark text-light border-secondary"
          placeholder="Ingrese la clave para recuperar el paste"
          onChange={(e) => setKeyId(e.target.value)}
          value={keyId}
        />
        <button className="btn btn-warning" onClick={handleBuscar}>Buscar</button>
      </div>
    </div>
  );
};

export default PasteInput;