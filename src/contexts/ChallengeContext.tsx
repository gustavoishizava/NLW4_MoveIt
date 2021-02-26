import { createContext, useState, ReactNode, useEffect } from 'react';
import { LevelUpModal } from '../components/LevelUpModal';

import Cookies from 'js-cookie';

import challenges from '../../challenges.json';

interface ChallengeProps {
    type: "body" | "eye";
    description: string;
    amount: number;
}

interface ChallengesContextData {
    level: number;
    currentExperience: number;
    challengesCompleted: number;
    experienceToNextLevel: number;
    activeChallenge: ChallengeProps | null;
    levelUp: () => void;
    startNewChallenge: () => void;
    resetChallenge: () => void;
    completeChallenge: () => void;
    closeLevelUpModal: () => void;
}

export const ChallengesContext = createContext<ChallengesContextData>({} as ChallengesContextData);

interface ChallengesProviderProps {
    children: ReactNode;
    level: number;
    currentExperience: number;
    challengesCompleted: number;
}

export function ChallengesProvider({ children, ...props }: ChallengesProviderProps) {
    const [level, setLevel] = useState(props.level ?? 1);
    const [currentExperience, setCurrentExperience] = useState(props.currentExperience ?? 0);
    const [challengesCompleted, setChallengesCompleted] = useState(props.challengesCompleted ?? 0);

    const [isLevelUpModalOpen, setIsLevelUpModalOpen] = useState(false);

    const [activeChallenge, setActiveChallenge] = useState<ChallengeProps | null>(null);

    const experienceToNextLevel = Math.pow((level + 1) * 4, 2);

    useEffect(() => {
        Notification.requestPermission();
    }, [])

    useEffect(() => {
        Cookies.set('level', String(level));
        Cookies.set('currentExperience', String(currentExperience));
        Cookies.set('challengesCompleted', String(challengesCompleted));
    }, [level, currentExperience, challengesCompleted]);

    function levelUp() {
        setLevel(level + 1);
        setIsLevelUpModalOpen(true);
    }

    function closeLevelUpModal(){
        setIsLevelUpModalOpen(false);
    }

    function startNewChallenge() {
        const randomChallengeIndex = Math.floor(Math.random() * challenges.length);
        const challenge = challenges[randomChallengeIndex] as ChallengeProps;

        setActiveChallenge(challenge);

        new Audio('/notification.mp3').play();

        if (Notification.permission === 'granted') {
            new Notification('Novo desafio', {
                body: `Valendo ${challenge.amount}xp!`
            })
        }
    }

    function resetChallenge() {
        setActiveChallenge(null);
    }

    function completeChallenge() {
        if (!activeChallenge) {
            return;
        }

        const { amount } = activeChallenge;

        let finalExperience = currentExperience + amount;

        if (finalExperience >= experienceToNextLevel) {
            finalExperience = finalExperience - experienceToNextLevel;
            levelUp();
        }

        setCurrentExperience(finalExperience);
        setActiveChallenge(null);
        setChallengesCompleted(challengesCompleted + 1);
    }

    return (
        <ChallengesContext.Provider
            value={
                {
                    level,
                    currentExperience,
                    challengesCompleted,
                    experienceToNextLevel,
                    activeChallenge,
                    levelUp,
                    startNewChallenge,
                    resetChallenge,
                    completeChallenge,
                    closeLevelUpModal
                }
            }
        >
            {children}

            {isLevelUpModalOpen &&
                <LevelUpModal />
            }
        </ChallengesContext.Provider>
    )
}