import React, { useState, useEffect } from 'react';
import styles from './verticalColorButton.module.scss';

interface verticalColorButtonProps {
    title: string;
    image: string;
    color: string;
}

const VerticalColorButton: React.FC<verticalColorButtonProps> = ({ title, image, color }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className={styles.verticalColorButton}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <img src={image} alt={title} />
            <span>{title}</span>
        </div>
    );
};

export default VerticalColorButton;