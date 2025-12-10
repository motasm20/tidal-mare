import React from 'react';

interface SectionHeaderProps {
    title: string;
    icon: React.ReactNode;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, icon }) => {
    return (
        <div className="section-header-container">
            <div className="section-header-content">
                <span className="section-icon">{icon}</span>
                <h3 className="section-title">{title}</h3>
            </div>
            <div className="section-divider"></div>
        </div>
    );
};
