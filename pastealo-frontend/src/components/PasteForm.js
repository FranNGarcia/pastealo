import React, { useRef, useState } from 'react';
import './PasteForm.css';
import AttachmentSection from './AttachmentSection';

const PasteForm = ({ keyId, paste, setPaste, loading, setLoading, setAttachedFile, attachedFile, fetchedFileInfo, setfetchedFileInfo }) => {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const caracteresMax = 3075;

  // hace click en el input file
  const handleFileButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      setAttachedFile(prevFiles => [...prevFiles, ...files]);
    }
    // sirve para volver a seleccionar el mismo archivo despues de sacarlo
    event.target.value = null;
  };

  const handleRemoveAttachment = (index) => {
    const newAttachments = [...attachedFile];
    newAttachments.splice(index, 1);
    setAttachedFile(newAttachments);
  }

  const handlePaste = (event) => {
    const items = event.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].kind === 'file') {
        const file = items[i].getAsFile();
        setAttachedFile(prevFiles => [...prevFiles, file]);
        event.preventDefault();
      }
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragActive(false); // Quita el estado de drag
    const files = Array.from(event.dataTransfer.files);
    if (files.length > 0) {
      setAttachedFile(prevFiles => [...prevFiles, ...files]);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragActive(true); // Activa el estado de drag
  };

  const handleDragLeave = (event) => {
    // Solo desactiva si realmente sale del área del textarea
    if (event.target === event.currentTarget) {
      setDragActive(false);
    }
  };

  return (
    <>
      {dragActive && (
        <div className="paste-overlay">
          <span>¡Suelta el archivo para adjuntarlo!</span>
        </div>
      )}
      <div className="mb-3 position-relative">
        <label htmlFor="content" className="form-label">Contenido del paste:</label>
        <div className="progress">
          <div className="progress-bar bg-warning" role="progressbar" style={{ width: `${(paste.length / caracteresMax) * 100}%` }} aria-valuenow="40" aria-valuemin="0" aria-valuemax="100"></div>
        </div>
        {paste.length > 2899 && (
          <span className="text-secondary small">
            {paste.length}/{caracteresMax} caracteres
          </span>
        )}
        <textarea
          id="content"
          className={`form-control bg-dark text-light border-secondary ${dragActive ? 'border-warning bg-secondary bg-opacity-25' : ''}`}
          rows="5"
          placeholder={
            dragActive
              ? "Arrastre aquí para adjuntar archivos"
              : (loading ? "Buscando..." : "Pegá acá el texto que querés guardar")
          }
          value={paste}
          onChange={(e) => setPaste(e.target.value)}
          disabled={loading}
          onPaste={handlePaste}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          maxLength={3075}
        ></textarea>

        {loading && (
          <div className="position-absolute top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center rounded"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
            <div className="spinner-grow text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}
        {/* input invisible que es usado por handleFileButtonClick */}
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
          multiple
        />

        <div className="d-flex justify-content-between align-items-center mt-2">
          <div className="d-flex flex-wrap">
            {attachedFile && attachedFile.length > 0 && (
              <div className="file-badges">
                {attachedFile.map((file, index) => (
                  <span
                    key={index}
                    className="badge bg-secondary me-1 mb-1 d-flex align-items-center"
                    style={{ maxWidth: "150px", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}
                    title={file.name}
                  >
                    {file.name}
                    <button
                      className="btn-close btn-close-white ms-1 p-0"
                      style={{ fontSize: "0.5rem" }}
                      onClick={() => handleRemoveAttachment(index)}
                      aria-label="Close"
                    ></button>
                  </span>
                ))}
              </div>
            )}
          </div>
          <button className="btn btn-warning btn-sm" onClick={handleFileButtonClick} type="button" disabled={loading}>
            <i className="bi bi-paperclip"></i>
          </button>
        </div>

        {fetchedFileInfo && fetchedFileInfo.length > 0 && (
          <AttachmentSection
            fetchedFileInfo={fetchedFileInfo}
            setfetchedFileInfo={setfetchedFileInfo}
            //estos datos los uso para reconstruir el paste y ahorrar una consulta a la api (servidores free)
            pasteText={paste}
            keyId={keyId}
          />
        )}

      </div>
    </>
  )
};

export default PasteForm;