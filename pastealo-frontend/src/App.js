import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { getPasteById, postPasteApi } from './services/pasteAPI';

// Importar componentes
import Header from './components/Header';
import PasteInput from './components/PasteInput';
import PasteForm from './components/PasteForm';
import SaveButton from './components/SaveButton';

const App = () => {
  const [paste, setPaste] = useState('');
  const [keyId, setKeyId] = useState('');
  const [loading, setLoading] = useState(false);

  // Métodos para hacer las llamadas a la API
  const fetchPastes = async () => {
    try {
      setLoading(true);
      const data = await getPasteById(keyId);
      setPaste(data.text);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        alert(`No se encontró el paste con ID: ${keyId}`);
      } else {
        alert('Se produjo un error al buscar el paste. Intentalo mas tarde.');
      }
    } finally {
      setLoading(false);
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

  // Handlers para los botones
  const handleBuscar = () => {
    if (keyId) {
      fetchPastes();
    }
  };

  const handleGuardar = () => {
    if (keyId && paste) {
      postPaste();
    }
  };

  return (
    <div className="app-container">
      <div className="app-content">
        <Header />
        <PasteInput
          keyId={keyId}
          setKeyId={setKeyId}
          handleBuscar={handleBuscar}
        />
        <PasteForm
          paste={paste}
          setPaste={setPaste}
          loading={loading}
        />
        <SaveButton
          handleGuardar={handleGuardar}
        />
      </div>
    </div>
  );
};

export default App;
