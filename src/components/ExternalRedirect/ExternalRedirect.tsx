import React, { useEffect } from 'react';

interface ExternalRedirectProps {
  url: string;
}

const ExternalRedirect: React.FC<ExternalRedirectProps> = ({ url }) => {
  useEffect(() => {
    // Redirect to external URL
    window.location.href = url;
  }, [url]);

  // Show loading message while redirecting
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      fontSize: '16px',
      color: '#666'
    }}>
      Redirecting to login...
    </div>
  );
};

export default ExternalRedirect;
