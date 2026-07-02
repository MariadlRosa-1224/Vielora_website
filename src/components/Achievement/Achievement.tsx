import React, { useState, useEffect } from 'react';
import styles from './Achievement.module.scss';


interface AchievementProps {
    title: string;
    image: string;
    color: string;
    description: string;
    state: string;
}

const Achievement: React.FC<AchievementProps> = ({title, image, color, description, state}) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className={styles.Achievement}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className={styles.circle}>
                <img src={image} alt={title} />
            </div>

            <div className={styles.content}>
                <span>{title}</span>
                <p>{description}</p>
                <p className='italic underline'>{state}</p>  
            </div>
            

        </div>
    );
}

export default Achievement;