import React, { useState, useEffect } from 'react';
import styles from './TransparentDropdown.module.scss';


interface TransparentDropdownProps {
    chapter: string;  
}

const TransparentDropdown: React.FC<TransparentDropdownProps> = ({chapter}) => {
    const chapters = ["Chapter I", "Chapter II", "Chapter III", "Chapter IV", "Chapter V", "Chapter VI", "Chapter VII", "Chapter VIII", "Chapter IX", "Chapter X"]
    const [isHovered, setIsHovered] = useState(false);


    return (
        <div
            className= {styles.TransparentDropdown}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {setIsHovered(false);} }
        >
            <div>
                <h3>{chapter}</h3>
            </div>
            <div className={styles.dropdown}>
            {chapters.map((chapter, i) => (
                <div className={styles.dropContent}>
            <p key={i} >{chapter}</p>
            </div>
            ))}
            
            </div>
        </div>
    );
}

export default TransparentDropdown;