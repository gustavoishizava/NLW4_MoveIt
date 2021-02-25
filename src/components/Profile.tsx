import { useContext } from 'react';
import { ChallengesContext } from '../contexts/ChallengeContext';
import styles from '../styles/pages/Profile.module.css';

export function Profile(){
    const { level } = useContext(ChallengesContext);


    return (
        <div className={styles.profileContainer}>
            <img src="https://github.com/gustavoishizava.png" alt="Gustavo Ishizava"/>
            <div>
                <strong>Gustavo C. Ishizava</strong>
                <p>
                    <img src="icons/level.svg" alt="Level" />
                    Level {level}
                </p>
            </div>
        </div>
    );
}