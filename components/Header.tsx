// filepath: components/Header.tsx
import React, { forwardRef } from 'react';

interface HeaderProps {
  title: string;
  isVisible?: boolean;
  onMouseEnter?: React.MouseEventHandler<HTMLElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLElement>;
}

// Wrap the component definition with forwardRef
const Header = forwardRef<HTMLElement, HeaderProps>(({ title, isVisible, onMouseEnter, onMouseLeave }, ref) => {
  return (
    <header
      ref={ref}
      style={{
        padding: '1rem',
        backgroundColor: '#f0f0f0',
        borderBottom: '1px solid #ccc',
        textAlign: 'center',
        position: 'sticky',
        top: 0,
        zIndex: 10,
        textTransform: 'capitalize',
        transition: 'opacity 0.5s ease-in-out, visibility 0.5s ease-in-out',
        opacity: isVisible ? 1 : 0,
        visibility: isVisible ? 'visible' : 'hidden',
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <h1>{title}</h1>
    </header>
  );
});

// Add display name for DevTools
Header.displayName = 'Header';

export default Header;
