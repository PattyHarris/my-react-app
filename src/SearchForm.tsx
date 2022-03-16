import React from 'react';
import styles from './App.module.css';

import InputWithLabel from './InputWithLabel';

type SearchFormProps = {
    searchTerm: string;
    onSearchInput: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onSearchSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};
  
// ====================================
// SearchForm
// ====================================

const SearchForm = ({
searchTerm,
onSearchInput,
onSearchSubmit
} : SearchFormProps ) => (

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
);


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

export default SearchForm;