import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'; // Import the CSS file

import { getPasteById, postPasteApi} from './services/pasteAPI';

const App = () => {
  const [paste, setPaste] = useState('');
  const [keyId, setKeyId] = useState('');


  //los metodos para hacer las llamadas a la api
  const fetchPastes = async () => {
    try {
      const data = await getPasteById(keyId);
      setPaste(data.text);
    } catch (error) {
      console.error('Error fetching paste:', error);
      setPaste('');
    }
  };

  const postPaste = async () => {
    try {
      const data = await postPasteApi(keyId, paste);
      if (data) {
        alert('Paste guardado correctamente');
      }
    } catch (error) {
      console.error('Error posting paste:', error);
      
    }
  };

  //los handles para los botones
  const handleBuscar = () => {
    if (keyId){
      fetchPastes();
    }
  }

  const handleGuardar = () => {
    if (keyId && paste){
      postPaste(keyId, paste);
    }
  }

  return (
    <div className="app-container">
      <div className="app-content">
        <h4 className="mb-4 text-warning">&gt; Pastealo</h4>

        {/* Key ID Input */}
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

        {/* Content Textarea */}
        <div className="mb-3">
          <label htmlFor="content" className="form-label">Contenido del paste:</label>
          <textarea
            id="content"
            className="form-control bg-dark text-light border-secondary"
            rows="5"
            placeholder="Pegá acá el texto que querés guardar"
            value={paste}
            onChange={(e) => setPaste(e.target.value)}
          ></textarea>
          <div className="d-flex justify-content-end">
            <button className="btn btn-warning btn-sm mt-2">+</button>
          </div>
        </div>

        {/* Upload Button */}
        <div className="d-grid">
          <button className="btn btn-warning" onClick={handleGuardar} >Guardar</button>
        </div>
      </div>
    </div>
  );
};

export default App;
