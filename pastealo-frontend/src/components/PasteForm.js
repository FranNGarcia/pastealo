import React from 'react';

const PasteForm = ({ paste, setPaste, loading, setLoading }) => {
  return (
    <div className="mb-3 position-relative">
      <label htmlFor="content" className="form-label">Contenido del paste:</label>
      <textarea
        id="content"
        className="form-control bg-dark text-light border-secondary "
        rows="5"
        placeholder={loading ? "Buscando..." : "Pegá acá el texto que querés guardar"}
        value={paste}
        onChange={(e) => setPaste(e.target.value)}
        disabled={loading}
      ></textarea>

      {loading && (
        <div className="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center rounded"
          style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
          <div className="spinner-grow text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      <div className="d-flex justify-content-end">
        <button className="btn btn-warning btn-sm mt-2">+</button>
      </div>
    </div>
  );
};

export default PasteForm;