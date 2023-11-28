import React from 'react';
import "./CloseButton.css"
import { useTranslation } from "react-i18next";
function CloseButton({ closeModal }) {
    const { t } = useTranslation();
    return (
        <button className="CloseButton" onClick={closeModal}>
            <img className ="CloseButtonImg" src="img/dding/closebutton.png" alt="CloseButton Icon" />
            <span className="CloseButtonText">{t(`Close.Close1`)}</span>
        </button>
    );
}

export default CloseButton;
