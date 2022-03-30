
import React from 'react';
import styles from './App.module.css';

type NextPageProps = {
    searchTerm: string;
    page: number;
    numberOfPages: number;
    onNextPage: (page: number) => void;
};

const NextPage = ({
    searchTerm,
    page,
    numberOfPages,
    onNextPage
}: NextPageProps) => {

    const handleNextPageClick = (
        event: React.MouseEvent<HTMLButtonElement>
        ) => {
        
        // const button: HTMLButtonElement = event.currentTarget;
        // const page: number = button.value;

        onNextPage(page + 1);
        event.preventDefault();
    };

    return (
        <div className={styles.nextPageContent}>
            <button 
                onClick={handleNextPageClick}
                className={`${styles.button} ${styles.buttonNext}`}
                disabled={ ( (page + 1) === numberOfPages) }
            >Next Page</button>
        </div>        
    )

};
 
export default NextPage;