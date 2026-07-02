import React, { useState, useEffect } from 'react';
import styles from './HorizontalColorButton.module.scss';


interface HorizontalColorButtonProps {
    title: string;
    image: string;
    color: string;
}

const HorizontalColorButton: React.FC<HorizontalColorButtonProps> = ({title, image, color}) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className={styles.horizontalColorButton}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <img src={image} alt={title} />
            <span>{title}</span>
        </div>
    );
}

export default HorizontalColorButton;