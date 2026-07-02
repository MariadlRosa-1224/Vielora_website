import React, { useState, useEffect } from 'react';
import styles from './HorizontalColorButtonBig.module.scss';


interface HorizontalColorButtonBigProps {
    title: string;
    color: string;
    description: string;
}



const HorizontalColorButtonBig: React.FC<HorizontalColorButtonBigProps> = ({title, color, description}) => {
    const [isHovered, setIsHovered] = useState(false);
    

    return (
        <div
            className={styles.HorizontalColorButtonBig}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            
            <h4>{title}</h4>
            <p>{description}</p>
        </div>
    );
}

export default HorizontalColorButtonBig;