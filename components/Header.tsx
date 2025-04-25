import React from 'react';

interface HeaderProps {
    title: string;
    isVisible?: boolean;
    // Add optional event handlers to the interface
    onMouseEnter?: React.MouseEventHandler<HTMLElement>;
    onMouseLeave?: React.MouseEventHandler<HTMLElement>;
}

// Basic Header component
const Header: React.FC<HeaderProps> = ({ title, isVisible, onMouseEnter, onMouseLeave }) => {
    return (
        // Apply the passed event handlers to the header element
        <header
            style={{
                padding: '1rem',
                backgroundColor: '#f0f0f0',
                borderBottom: '1px solid #ccc',
                textAlign: 'center',
                position: 'sticky', // Make header sticky
                top: 0,             // Stick to the top
                zIndex: 10,         // Ensure it's above other content
                textTransform: 'capitalize', // Capitalize the title
                transition: 'opacity 0.5s ease-in-out, visibility 1s ease-in-out',  // Add transition for smooth show/hide
                opacity: isVisible ? 1 : 0,
                visibility: isVisible ? 'visible' : 'hidden',
            }}
            onMouseEnter={onMouseEnter} // Apply mouse enter handler
            onMouseLeave={onMouseLeave} // Apply mouse leave handler
        >
            <h1>{title}</h1>
        </header>
    );
};

export default Header;