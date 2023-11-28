// ServiceWorkerListener.js
import React, { useEffect, useState } from 'react';

function ServiceWorkerListener(props) {
  const [modalContent, setModalContent] = useState('');

  useEffect(() => {
    const handleServiceWorkerMessage = (event) => {
      const payload = event.data;
      setModalContent(payload.notification.body);
      props.onMessage(payload);
    };

    navigator.serviceWorker.addEventListener('message', handleServiceWorkerMessage);

    return () => {
      navigator.serviceWorker.removeEventListener('message', handleServiceWorkerMessage);
    };
  }, [props]);

  return null;
}

export default ServiceWorkerListener;
