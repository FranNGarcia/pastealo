import React from 'react';
import { useTranslation } from 'react-i18next';

const PasteInput = ({ keyId, setKeyId, handleBuscar }) => {
  const { t } = useTranslation();
  
  return (
    <div className="mb-3">
      <label htmlFor="keyId" className="form-label">{t('search.label')}</label>
      <div className="input-group">
        <input
          type="text"
          id="keyId"
          className="form-control bg-dark text-light border-secondary"
          placeholder={t('search.placeholder')}
          onChange={(e) => setKeyId(e.target.value)}
          value={keyId}
        />
        <button className="btn btn-warning bi bi-search" onClick={handleBuscar}>{t('search.button')}</button>
      </div>
    </div>
  );
};

export default PasteInput;