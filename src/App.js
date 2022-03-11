import React from 'react';
import axios from 'axios';
import styles from './App.module.css';

import { ReactComponent as Check } from './checkmark.svg';

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';

// Handle 'effects' - meaning, handle the side-effect each time searchTerm
// changes.  The first argument is a function where the side-effect occurs.  The
// second argument is a dependency array of variables.  If one variable changes, the
// function for the side-effect is called.

// Custom React hook - basically takes the useEffect and useState hook that was specific
// to search and converts it to one that can be used for any local storage.
// Note that this is OUTSIDE of the App function...
const useSemiPersistentState = (key, initialState) => {

  // Added for performance...
  const isMounted = React.useRef(false);

  const [value, setValue] = React.useState(
    localStorage.getItem(key) || initialState
  );

  React.useEffect( () => {

    if (!isMounted.current) {
      isMounted.current = true;
    }
    else {
      console.log('A');
      localStorage.setItem(key, value);
    }
    
  }, [value, key]);

  return [value, setValue];

}

// Reducer here is used in place of the useState and useEffect.
const storiesReducer = (state, action) => {
  switch (action.type) {
    
    case 'STORIES_FETCH_INIT':
      return {
        ...state, 
        isLoading: true,
        isError: false
      };
    case 'STORIES_FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload
      };
    case 'STORIES_FETCH_FAILURE':
      return {
        ...state,
        isLoading: false,
        isError: true
      };
    case 'REMOVE_STORY':
      return {
        ...state,
        data: state.data.filter( 
          story => action.payload.objectID !== story.objectID)
      };
    default:
      throw new Error();
  }
};

// ====================================
// Sum of comments
// ====================================

// Added to show performance and 'useMemo'
const getSumComments = (stories) => {
  console.log('C');

  return stories.data.reduce(
    (result, value) => result + value.num_comments, 0
  );
};

// ====================================
// ====================================

const App = () => {

  // Custom React hook.
  const [searchTerm, setSearchTerm] = useSemiPersistentState(
    'search',
    'React'
  );

  const [url, setURl] = React.useState(
    `${API_ENDPOINT}${searchTerm}`
  );

  const [stories, dispatchStories] = React.useReducer(
    storiesReducer,
    { data: [], isLoading: false, isError: false }
  );

  const handleFetchStories = React.useCallback( async() => {

    dispatchStories({type: 'STORIES_FETCH_INIT'});

    try {
    const result = await axios.get( url );

    dispatchStories({
      type: 'STORIES_FETCH_SUCCESS',
      payload: result.data.hits
    });
  }
  catch {
    dispatchStories( {type: 'STORIES_FETCH_FAILURE'});
  }

  }, [url]);

  // Added with the 'useCallback' for memoized callbacks.
  React.useEffect( () => {
    handleFetchStories();
  }, [handleFetchStories])

  // 'useCallback' added for performance tweak.
  const handleRemoveStory = React.useCallback( (item) => {
    dispatchStories({
      type: 'REMOVE_STORY',
      payload: item
    });
  }, []);

  // Callback for the Search component - set the local storage by using 'useEffect'.
  const handleSearchInput = event => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    setURl(`${API_ENDPOINT}${searchTerm}`);
    event.preventDefault();
  };
  
  console.log('B:App');

  const sumComments = React.useMemo( () => getSumComments(stories), [stories]);

  return (
    <div className={styles.container}>
      <h1 className={styles.headlinePrimary}>My Hacker Stories with {sumComments} comments.</h1>
      
      <SearchForm 
        searchTerm={searchTerm}
        onSearchInput={handleSearchInput}
        onSearchSubmit={handleSearchSubmit}
      />

      {stories.isError && <p>Something went wrong ...</p>}
      {stories.isLoading ? (
        <p>Loading...</p>
      ) : (
        <List list={stories.data} onRemoveItem={handleRemoveStory} />
      )}

    </div>
  );

};

// ====================================
// SearchForm
// ====================================

const SearchForm = ({
  searchTerm,
  onSearchInput,
  onSearchSubmit
}) => (
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
// InputWithLabel
// ====================================

// Using destructured props..and now made re-usable by the addition of id, label and renaming
// the props to something more generic.
const InputWithLabel = ({ 
    id, 
    value, 
    type='text',
    onInputChange, 
    isFocused, 
    children }) => {

  const inputRef = React.useRef();

  React.useEffect( () => {
    if ( isFocused && inputRef.current ) {
      inputRef.current.focus();
    }
  }, [isFocused]);

  return (
    <>
      <label htmlFor={id} className={styles.label}>{children}</label>
      &nbsp;
      <input 
        ref={inputRef}
        id={id} 

        type = {type} 
        value={value}

        onChange={onInputChange} 
        className={styles.input}
      />
    </>
    );
};

// ====================================
// LabelText
// ====================================

// Exercise: create a text component that renders a string.
// Note that labelText MUST be passed as an object since React functional components
// accept only a single 'props'...

const LabelText = ({labelText}) => (
    <>
    <strong>{labelText}</strong>
    </>
);

// ====================================
// List
// ====================================

// Again using destructured objects - so props becomes {list, onRemoveItem}
// React.memo added for performance, although as indicated, does not 
// prevent re-renders..

const List = React.memo( ({list, onRemoveItem}) => 

  console.log('B:List') ||
  list.map(item => (
    <Item 
      key={item.objectID} 
      item={item}
      onRemoveItem={onRemoveItem}
      />
    ))
);
  
// ====================================
// Item
// ====================================
const Item = ( {item, onRemoveItem} ) => (
    <div className={styles.item}> 
    <span style={{ width: '40%'}}>
      <a href={item.url}>{item.title}</a>
    </span>
    
    <span style={{ width: '30%'}}>{item.author}</span>
    <span style={{ width: '10%'}}>{item.num_comments}</span>
    <span style={{ width: '10%'}}>{item.points}</span>
    <span style={{ width: '10%'}}>
      <button 
        type="button" 
        onClick={ () => onRemoveItem(item)}
        className={`${styles.button} ${styles.buttonSmall}`}
        >
        <Check height="18px" width="18px" />
      </button>
    </span>
    </div>
);

export default App;
