import React, { useState, useEffect, ReactNode } from 'react';
import styles from './GeneralContainerNoBorder.module.scss';

interface GeneralContainerNoBorderProps{
     newwidth: string;
     newheight: string;
     children: ReactNode
}

const GeneralContainerNoBorder: React.FC<GeneralContainerNoBorderProps> = ({newwidth, newheight, children}) => {
    return (
        <section className={styles.GeneralContainerNoBorder} style={{width: newwidth, height: newheight}}>
            {children}
        </section>
    );

}

export default GeneralContainerNoBorder