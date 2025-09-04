import React from 'react';
import { useTranslation } from 'react-i18next';

const SaveButton = ({ handleGuardar }) => {
  const { t } = useTranslation();
  
  return (
    <div className="d-grid">
      <button className="btn btn-warning bi bi-floppy" onClick={handleGuardar}>{t('save.button')}</button>
    </div>
  );
};

export default SaveButton;