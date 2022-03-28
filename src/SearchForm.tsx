
import React from 'react';
import styles from './App.module.css';

import InputWithLabel from './InputWithLabel';

type SearchFormProps = {
    searchTerm: string;
    urls: Array<string>;
    onSearchInput: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onSearchSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    onLastSearch: (searchTerm: string) => void;
};

type LastSearchesProps = {
    urls: Array<string>;
    onLastSearch: (searchTerm: string) => void;
};

// ====================================
// SearchForm
// ====================================

const SearchForm = ({
    searchTerm,
    urls,
    onSearchInput,
    onSearchSubmit,
    onLastSearch
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
        
        <LastSearches urls={urls} onLastSearch={onLastSearch} />
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
// Remove duplicates from the last searches. No used since I've replaced my
// solution with the instructor's solution.
//------------------------------

/*
const removeDuplicates = (data: Array<string>) : Array<string> => {
    return data.filter((value, index) => data.indexOf(value) === index);
}*/

//------------------------------
// Row of buttons of the last 5 search queries.
//------------------------------
const LastSearches = ({
    urls,
    onLastSearch
    } : LastSearchesProps ) => {
    
    // We want to show the last 5 searches, minus the current search.
    // The searches should not have any duplicates.  Question is whether when the
    // last 5 searches are all the same - e.g. seven one one one one one one...
    // do you show 'seven one' or just 'one'?  Here I've decided to show 'seven one',
    // meaning, remove the dups and then from that take the last five...
    
    /* Commenting out to use the instructor's solution
    const getLastSearches = (urls: Array<string>): Array<string> => {
        const noDuplicates = removeDuplicates(urls);
        const lastSearches =  noDuplicates.slice(-6, -1).map(queryString);
        return lastSearches;
    }*/

    const getLastSearches = (urls: Array<string>): Array<string> => {
        const lastSearches = 
        urls
            .reduce((result: Array<string>, url:string, index: number) => {
                const searchTerm: string = queryString(url);

                if (index === 0) {
                    return result.concat(searchTerm);
                }

                const previousSearchTerm = result[result.length - 1];

                if (searchTerm === previousSearchTerm) {
                    return result;
                } 
                else {
                    return result.concat(searchTerm);
                }
        }, [])
        .slice(-6)
        .slice(0, -1);

        return lastSearches;
    }
    
    const lastSearches: Array<string> = getLastSearches(urls);
    
    const handleClick = (
        event: React.MouseEvent<HTMLButtonElement>
        ) => {
        
        const button: HTMLButtonElement = event.currentTarget;
        onLastSearch(button.value);
        event.preventDefault();
    };
    
    return (

        <div className={`${styles.buttonsSearch}`}>

        <label className={`${styles.labelSearch}`}>Recent Searches: </label>

            {
            lastSearches.map( (query: string, index: number) => {
                
                return (
                    
                    <React.Fragment key={index + query}>
                        <button
                            value={query}
                            className={`${styles.button} ${styles.buttonSearch}`}
                            onClick={handleClick}
                            >
                            {query}
                        </button>
                    </React.Fragment>
                )
            })
            }
        </div>
)};

export default SearchForm;