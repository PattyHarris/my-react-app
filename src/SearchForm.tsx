
import React from 'react';
import styles from './App.module.css';

import InputWithLabel from './InputWithLabel';

type SearchFormProps = {
    searchTerm: string;
    urls: Array<string>;
    onSearchInput: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onSearchSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

type SearchButtonsProps = {
    urls: Array<string>;
    onSearchSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

// ====================================
// SearchForm
// ====================================

const SearchForm = ({
    searchTerm,
    urls,
    onSearchInput,
    onSearchSubmit
} : SearchFormProps ) => {
    
    return (
        <div>
        <form onSubmit={onSearchSubmit} className={styles.searchForm}>
            <InputWithLabel 
            id="search"
            value={searchTerm} 
            isFocused
            onInputChange={onSearchInput} >
            
            <LabelText labelText='Search:'></LabelText>

            </InputWithLabel>

            <button
            type="submit"
            disabled={!searchTerm}
            className={`${styles.button} ${styles.buttonLarge}`}
            >
            Submit
            </button>
        </form>
        
        <SearchButtons urls={urls} onSearchSubmit={onSearchSubmit} />
        </div> 
)};


// ====================================
// LabelText
// ====================================

// Exercise: create a text component that renders a string.
// Note that labelText MUST be passed as an object since React functional components
// accept only a single 'props'...

const LabelText = ({labelText} : { labelText: string} ) => (
    <>
    <strong>{labelText}</strong>
    </>
);

// ====================================
// SearchButtons
// ====================================

// Exercise to show the last 5 searches with accompanying buttons.
// Used in conjunction with the urls and setUrls (see App).

//------------------------------
// Find the query string from the URL
//------------------------------
const queryString = (url: string) : string => {

    const paramsString = url.split('?')[1];
    const searchParams = new URLSearchParams(paramsString);

    /* We only have 1 query string...
    for (let [key, value] of searchParams) {
        console.log(key, value);
        break;
    }*/

    // Converts the iterable to an array so we can pull off
    // the first value...
    const values = [...searchParams.values()];
    return values[0]
}

//------------------------------
// Row of buttons of the last 5 search queries.
//------------------------------
const SearchButtons = ({
    urls,
    onSearchSubmit
    } : SearchButtonsProps ) => {
     
    return (
        <div className={`${styles.buttonsSearch}`}>

        <label className={`${styles.labelSearch}`}>Recent Searches: </label>

        <form onSubmit={onSearchSubmit} className={`${styles.lastSearchesForm}`}>
            {
            urls.slice(-5).map( (url: string, index: number) => {
                return (
                    index < 5 &&
                    <React.Fragment key={index}>
                        <button
                            type="submit"
                            value={url}
                            className={`${styles.button} ${styles.buttonSearch}`}>
                                {queryString(url)}
                            </button>
                    </React.Fragment>
                )
            })
            }
        </form>
        </div>

)};

export default SearchForm;