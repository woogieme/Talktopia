// src/components/OneToOneButton.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from "react-i18next";
function FriendSearch() {
  const { t } = useTranslation();
  return (
    <div>
      <Link to="/search-find">
      <button>{t(`FriendSearch.FriendSearch1`)}</button>
      </Link>
    </div>
  );
}

export default FriendSearch;
