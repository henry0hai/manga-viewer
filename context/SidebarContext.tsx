// filepath: context/SidebarContext.tsx
import React, { createContext, useState, useContext, useCallback, ReactNode } from 'react';

// Define the shape of the context data
interface SidebarContextProps {
    isOpen: boolean;
    toggleSidebar: () => void;
    closeSidebar: () => void;
}

// Create the context with a default value (can be null or an initial state)
// Using null requires checking for null when consuming, or providing a guaranteed initial value.
const SidebarContext = createContext<SidebarContextProps | null>(null);

// Create a Provider component
interface SidebarProviderProps {
    children: ReactNode;
}

export const SidebarProvider: React.FC<SidebarProviderProps> = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false); // The actual state lives here

    const toggleSidebar = useCallback(() => {
        setIsOpen(prev => {
            const newState = !prev;
            return newState;
        });
    }, []);

    const closeSidebar = useCallback(() => {
        if (isOpen) {
            setIsOpen(false);
        }
    }, [isOpen]);

    // Value provided to consuming components
    const value = { isOpen, toggleSidebar, closeSidebar };

    return (
        <SidebarContext.Provider value={value}>
            {children}
        </SidebarContext.Provider>
    );
};

// Create a custom hook for easy consumption
export const useSidebarContext = () => {
    const context = useContext(SidebarContext);
    if (context === null) {
        throw new Error('useSidebarContext must be used within a SidebarProvider');
    }
    return context;
};