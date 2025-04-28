// filepath: components/SidebarToggle.tsx
import React from 'react';
import { useSidebarContext } from '../context/SidebarContext'; // Import the context hook

const SidebarToggle: React.FC = () => {
  // Use the context hook
  const { isOpen, toggleSidebar } = useSidebarContext(); 

  return (
    <button onClick={toggleSidebar} style={{
        position: 'fixed',
        top: '15px',      
        left: isOpen ? '260px' : '15px', 
        zIndex: 1100,     
        background: '#eee',
        border: '1px solid #ccc',
        borderRadius: '50%',
        width: '40px',
        height: '40px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'left 0.3s ease', 
        fontSize: '1.5rem', 
    }}>
        {isOpen ? '‹' : '☰'}
        <span style={{ position: 'absolute', width: '1px', height: '1px', margin: '-1px', overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', border: 0 }}>
            {isOpen ? 'Close Sidebar' : 'Open Sidebar'}
        </span>
    </button>
  );
};

export default SidebarToggle;