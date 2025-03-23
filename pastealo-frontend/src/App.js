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
  const [attachedFile, setAttachedFile] = useState([]); // los archivos adjuntos pero no subidos
  const [loading, setLoading] = useState(false);
  const [fetchedFileInfo, setfetchedFileInfo] = useState([]); // los archivos del paste

  // metodos para hacer las llamadas a la API
  const fetchPastes = async () => {
    try {
      setLoading(true);
      const data = await getPasteById(keyId);
      setPaste(data.text);
      if (data.attachments && Array.isArray(data.attachments)) {
        setfetchedFileInfo(data.attachments);
      }
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


  const handleUploadFile = async (file) => {
    try {
      //const file = attachedFile[0];
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
        let currentfetchedFileInfo = [...fetchedFileInfo];

        if (attachedFile.length > 0) {
          for (let i = 0; i < attachedFile.length; i++) {
            const file = attachedFile[i];
            var uploadResponse = await handleUploadFile(file);
            currentfetchedFileInfo = [...currentfetchedFileInfo, uploadResponse];
            setfetchedFileInfo(currentfetchedFileInfo);
          }
        }

        const data = await postPasteApi(keyId, paste, currentfetchedFileInfo);

        if (data) {
          alert('Paste guardado correctamente');
        }
        setAttachedFile([]);

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
          keyId={keyId}
          paste={paste}
          setPaste={setPaste}
          loading={loading}
          setAttachedFile={setAttachedFile}
          attachedFile={attachedFile}
          fetchedFileInfo={fetchedFileInfo}
          setfetchedFileInfo={setfetchedFileInfo}
        />
        <SaveButton
          handleGuardar={handleGuardar}
        />
      </div>
    </div>
  );
};

export default App;
