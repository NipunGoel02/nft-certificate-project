// src/components/Layout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  const backgroundStyle = {
    backgroundImage: `url('./image.png')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'fixed',
    minHeight: '100vh',
    width: '100%'
  };

  return (
    <div style={backgroundStyle}>
      {/* Your header, navigation, etc. */}
      <Outlet />
      {/* Your footer */}
    </div>
  );
};

export default Layout;
