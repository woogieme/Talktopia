// pages/PostFormPage.js
import React from 'react';
import PostForm from '../../components/faq/PostForm';
import useTokenValidation from '../../utils/useTokenValidation';

function PostFormPage() {
  useTokenValidation();

  return (
    <div>
      <PostForm />
    </div>
  );
}

export default PostFormPage;