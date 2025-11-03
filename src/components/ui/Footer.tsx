import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-neutral-200 bg-neutral-50">
      <div className="container-max py-8">
        <div className="text-center text-sm text-neutral-600">
          <p>© {currentYear} Folio. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
