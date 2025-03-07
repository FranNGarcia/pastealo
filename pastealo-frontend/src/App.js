import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { getPasteById, postPasteApi, uploadFile } from './services/pasteAPI';

// Importar componentes
import Header from './components/Header';
import PasteInput from './components/PasteInput';
import PasteForm from './components/PasteForm';
import SaveButton from './components/SaveButton';

const App = () => {
  const [paste, setPaste] = useState('');
  const [keyId, setKeyId] = useState('');
  const [attachedFile, setAttachedFile] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fileInfo, setFileInfo] = useState([]);

  // Métodos para hacer las llamadas a la API
  const fetchPastes = async () => {
    try {
      setLoading(true);
      const data = await getPasteById(keyId);
      setPaste(data.text);
      setAttachedFile(data.attachedFile);
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

  

  const handleUploadFile = async () => {
    try {
      const file = attachedFile[0];
      const response = await uploadFile(file);
      return response;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
  }

  // Handlers para los botones
  const handleBuscar = () => {
    if (keyId) {
      fetchPastes();
    }
  };

  const handleGuardar = async () => {
    if (keyId && (paste || attachedFile.length > 0)) {
      try {
        setLoading(true);
        console.log('file info ', fileInfo);
        let currentFileInfo = [...fileInfo];
        console.log('current File Info: ', currentFileInfo);
        if (attachedFile.length > 0) {
          var uploadResponse = await handleUploadFile();
          console.log('upload response: ', uploadResponse);
          currentFileInfo = [...currentFileInfo, uploadResponse];
          console.log('current File Info: ', currentFileInfo);
          // Also update the state
          setFileInfo(currentFileInfo);
        }
        
        // Pass the current file info directly
        const data = await postPasteApi(keyId, paste, currentFileInfo); // al parecer tiene que estar en lista
        
        if (data) {
          alert('Paste guardado correctamente');
        }
      } catch (error) {
        console.error('Error saving paste:', error);
        alert('Error al guardar el paste. Intentalo de nuevo.');
      } finally {
        setLoading(false);
      }
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
          setAttachedFile={setAttachedFile}
        />
        <SaveButton
          handleGuardar={handleGuardar}
        />
      </div>
    </div>
  );
};

export default App;
