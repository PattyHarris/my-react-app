import React from 'react';
import axios from 'axios';
import styles from './App.module.css';

import { ReactComponent as Check } from './checkmark.svg';

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';

// ====================================
// Typescript additions
// ====================================

type Story = {
  objectID: string;
  url: string;
  title: string;
  author: string;
  num_comments: number;
  points: number;
};

type Stories = Array<Story>;

type ListProps = {
  list: Stories;
  onRemoveItem: (item: Story) => void;
};

type ItemProps = {
  item: Story;
  onRemoveItem: ( item: Story ) => void;
}

type StoriesState = {
  data: Stories;
  isLoading: boolean;
  isError: boolean;
};

interface StoriesFetchInitAction {
  type: 'STORIES_FETCH_INIT';
}
interface StoriesFetchSuccessAction {
  type: 'STORIES_FETCH_SUCCESS';
  payload: Stories;
}

interface StoriesFetchFailureAction {
  type: 'STORIES_FETCH_FAILURE';
}

interface StoriesRemoveAction {
  type: 'REMOVE_STORY';
  payload: Story;
}

type StoriesAction =
  | StoriesFetchInitAction
  | StoriesFetchSuccessAction
  | StoriesFetchFailureAction
  | StoriesRemoveAction;

type SearchFormProps = {
  searchTerm: string;
  onSearchInput: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

type InputWithLabelProps = {
  id: string;
  value: string;
  type?: string;
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isFocused?: boolean;
  children: React.ReactNode;
}

// ====================================
// ====================================

// Handle 'effects' - meaning, handle the side-effect each time searchTerm
// changes.  The first argument is a function where the side-effect occurs.  The
// second argument is a dependency array of variables.  If one variable changes, the
// function for the side-effect is called.

// Custom React hook - basically takes the useEffect and useState hook that was specific
// to search and converts it to one that can be used for any local storage.
// Note that this is OUTSIDE of the App function...
const useSemiPersistentState = (key: string, initialState: string): [string, (newValue: string) => void] => {

  const [value, setValue] = React.useState(
    localStorage.getItem(key) || initialState
  );

  React.useEffect( () => {
    localStorage.setItem(key, value);
  }, [value, key]);

  return [value, setValue];

}

// Reducer here is used in place of the useState and useEffect.
const storiesReducer = (state: StoriesState, action: StoriesAction) => {
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
  const handleRemoveStory = (item: Story) => {
    dispatchStories({
      type: 'REMOVE_STORY',
      payload: item
    });
  };

  // Callback for the Search component - set the local storage by using 'useEffect'.
  const handleSearchInput = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    setURl(`${API_ENDPOINT}${searchTerm}`);
    event.preventDefault();
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.headlinePrimary}>My Hacker Stories</h1>
      
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
    children } : InputWithLabelProps) => {

  const inputRef = React.useRef<HTMLInputElement>(null!);

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

const LabelText = ({labelText} : { labelText: string} ) => (
    <>
    <strong>{labelText}</strong>
    </>
);

// ====================================
// List
// ====================================

// Again using destructured objects - so props becomes {list, onRemoveItem}
// The wrapping 'div' added to fix a type safety issue -  see README or 
// module.

const List = ({list, onRemoveItem} : ListProps) => (
  <>
  { list.map(item => (
    <Item 
      key={item.objectID} 
      item={item}
      onRemoveItem={onRemoveItem}
      />
    ))}
    </>
);
  
// ====================================
// Item
// ====================================
const Item = ( {item, onRemoveItem} : ItemProps ) => (
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

// Exported for jest
export { SearchForm, InputWithLabel, List, Item };