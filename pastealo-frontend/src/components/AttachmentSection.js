import React from 'react';
import { deleteFile, postPasteApi } from '../services/pasteAPI';

const AttachmentSection = ({ fetchedFileInfo, setfetchedFileInfo, keyId, pasteText }) => {

  const handleDeleteFile = async (file) => {
    try {
      //borro el archivo de cloudinary
      const deleteRes = await deleteFile(file.url, file.type);
      if (deleteRes.result.result !== 'ok') {
        throw new Error('Error borrando archivo de Cloudinary: ', deleteRes.result.result);
      } else {
        //elimino el registro de mi lista de archivos
        const newFiles = fetchedFileInfo.filter(f => f.url !== file.url);
        setfetchedFileInfo(newFiles);

        //modifico el paste en la bd para quitar el archivo haciendo upsert (uso los datos pasado por props para ahorrar una consulta)
        await postPasteApi(keyId, pasteText, newFiles);
      }

    } catch (error) {
      console.error('Error borrando archivo:', error);
      alert('Error al borrar el archivo. Por favor intenta de nuevo mas tarde.');
    }
  };

  const handleDownloadFile = async (file) => {
    try {
      // spinner que deshabilita el boton de descarga mientras se descarga el archivo
      const button = document.activeElement;
      button.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Descargando...';
      button.disabled = true;

      // traigo el archivo y lo convierto en un blob
      const response = await fetch(file.url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();

      // hago un url para el blob
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', file.name);

      // lo clickeo y lo borro
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);

      // vuelvo al estado inicial
      button.innerHTML = 'Descargar';
      button.disabled = false;
    } catch (error) {
      console.error('Error descargando archivo:', error);
      alert('Error al descargar el archivo. Por favor intenta de nuevo mas tarde.');

      const button = document.activeElement;
      if (button) {
        button.innerHTML = 'Descargar';
        button.disabled = false;
      }
    }
  };

  return (
    <div className="mt-3">
      <hr className="border-secondary" />
      <h6 className="text-light mb-2">Archivos adjuntos al paste:</h6>
      <div className="list-group bg-dark">
        {fetchedFileInfo.map((file, index) => (
          <div
            key={index}
            className="list-group-item bg-dark text-light border-secondary d-flex justify-content-between align-items-center"
          >
            <span className="text-truncate" style={{ maxWidth: "70%" }} title={file.name}>
              {file.name}
            </span>
            <div className="d-flex">
              <button className="btn btn-outline-danger btn-sm" onClick={() => handleDeleteFile(file)}>
                <i className="bi bi-trash-fill"></i>
              </button>
              <button className="btn btn-outline-warning btn-sm ms-2" onClick={() => handleDownloadFile(file)}>
                Descargar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttachmentSection;