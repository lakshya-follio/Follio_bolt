import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import follioIcon from '../../assets/follio-icon.svg';

interface HeaderProps {
  onLogout?: () => void;
  user?: { email?: string; name?: string } | null;
  showUserMenu?: boolean;
}

const Header: React.FC<HeaderProps> = ({ onLogout, user, showUserMenu = true }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-neutral-200">
      <div className="container-max">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2 md:gap-3">
            <img src={follioIcon} alt="Follio" className="w-8 h-8" />
            <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary-500 to-primary-600 bg-clip-text text-transparent">
              Folio
            </span>
          </div>

          <div className="hidden md:flex items-center gap-4">
            {showUserMenu && user && (
              <div className="flex items-center gap-3">
                <span className="text-sm text-neutral-600">
                  {user.name || user.email}
                </span>
                {onLogout && (
                  <button
                    onClick={onLogout}
                    className="btn-secondary btn-sm"
                  >
                    Logout
                  </button>
                )}
              </div>
            )}
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-neutral-100 rounded-lg transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-neutral-200 py-4">
            {showUserMenu && user && (
              <div className="space-y-3">
                <div className="px-0 py-2 text-sm font-medium text-neutral-700">
                  {user.name || user.email}
                </div>
                {onLogout && (
                  <button
                    onClick={() => {
                      onLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="btn-secondary btn-sm btn-block justify-center"
                  >
                    Logout
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
