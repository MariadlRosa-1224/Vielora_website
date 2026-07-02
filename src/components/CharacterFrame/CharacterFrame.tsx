import React, { useState, useEffect } from 'react';
import styles from './CharacterFrame.module.scss';

interface CharacterFrameProps {
    title: string;
    image: string;
    frame: string;
}

const CharacterFrame: React.FC<CharacterFrameProps> = ({ title, image , frame}) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className={styles.CharacterFrame}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}

            
        >

        <img src={frame} className={styles.frame}   />
        <div className={styles.background} style={{backgroundImage: image}}></div> 
        <div className={styles.overlay}></div> 
            
        <div className={styles.content}> 
            <span>{title}</span>
            <hr />
             </div>

        </div>
    );
};

export default CharacterFrame;