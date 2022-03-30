import React from 'react';
import axios from 'axios';

import styles from './App.module.css';

import SearchForm from 'SearchForm';
import LastSearches from 'LastSearches';
import NextPage from 'NextPage';

import List from 'List';

const API_ENDPOINT = 'https://hn.algolia.com/api/v1/search?query=';
const API_PAGE = '&page=';

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

type StoriesState = {
  data: Stories;
  isLoading: boolean;
  isError: boolean;
  page: number;
  numberOfPages: number;
};

interface StoriesFetchInitAction {
  type: 'STORIES_FETCH_INIT';
};

interface StoriesFetchSuccessAction {
  type: 'STORIES_FETCH_SUCCESS';
  payload: {
    list: Stories;
    page: number;
    numberOfPages: number;
  }
};

interface StoriesFetchFailureAction {
  type: 'STORIES_FETCH_FAILURE';
};

interface StoriesRemoveAction {
  type: 'REMOVE_STORY';
  payload: Story;
};

type StoriesAction =
  | StoriesFetchInitAction
  | StoriesFetchSuccessAction
  | StoriesFetchFailureAction
  | StoriesRemoveAction;

// ====================================
// ====================================

// Handle 'effects' - meaning, handle the side-effect each time searchTerm
// changes.  The first argument is a function where the side-effect occurs.  The
// second argument is a dependency array of variables.  If one variable changes, the
// function for the side-effect is called.

// Custom React hook - basically takes the useEffect and useState hook that was specific
// to search and converts it to one that can be used for any local storage.
// Note that this is OUTSIDE of the App function...
const useSemiPersistentState = (
  key: string, initialState: string): [string, (newValue: string) => void] => 
{

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
        isError: false,
        page: 0      
      };
    case 'STORIES_FETCH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: 
          action.payload.page === 0
          ? action.payload.list
          : state.data.concat(action.payload.list),
        
        page: action.payload.page,
        numberOfPages: action.payload.numberOfPages,
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

// Handle last 5 searches.
const getUrl = (searchTerm: string, page: number = 0) => {
  return `${API_ENDPOINT}${searchTerm}${API_PAGE}${page}`;
}

// ====================================
// ====================================

const App = () => {

  //------------------------
  // Custom React hook.
  const [searchTerm, setSearchTerm] = useSemiPersistentState(
    'search',
    'React'
  );

  //------------------------

  const [urls, setUrls] = React.useState<Array<string>>(
    [`${API_ENDPOINT}${searchTerm}`]
  );

  //------------------------
  const [stories, dispatchStories] = React.useReducer(
    storiesReducer,
    { data: [], isLoading: false, isError: false, page: 0, numberOfPages: 0 }
  );

  //------------------------
  const handleFetchStories = React.useCallback( async() => {

    dispatchStories({type: 'STORIES_FETCH_INIT'});

    try {
    const result = await axios.get( urls[urls.length - 1] );

    console.log("page ", result.data.page, "of pages ", result.data.nbPages)

    dispatchStories({
      type: 'STORIES_FETCH_SUCCESS',
      payload: {
        list: result.data.hits,
        page: result.data.page,
        numberOfPages: result.data.nbPages}
    });
  }
  catch {
    dispatchStories( {type: 'STORIES_FETCH_FAILURE'});
  }

  }, [urls]);

  //------------------------
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

  //------------------------
  // Callback for the Search component - set the local storage by using 'useEffect'.
  const handleSearchInput = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchTerm(event.target.value);
  };

  //------------------------
  const handleSearchSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {

    handleSearch(searchTerm);
    event.preventDefault();
  };

  //------------------------
  const handleLastSearch = (searchTerm: string) => {

    // Set the input text to the search button clicked.
    // Simple as that...
    setSearchTerm(searchTerm);
    handleSearch(searchTerm);
  };

  //------------------------
  const handleNextPage = (page: number) => {
    setSearchTerm(searchTerm);
    handleSearch(searchTerm, page);
  }

  //------------------------
  const handleSearch = (searchTerm: string, page: number = 0) => {
    const url = getUrl(searchTerm, page);
    setUrls(urls.concat(url));  
  };

  //------------------------
  //------------------------
  return (
    <div className={styles.container}>
      <h1 className={styles.headlinePrimary}>My Hacker Stories</h1>
      
      <section className={styles.content}>
      <div className={styles.searchContent}>

        <SearchForm 
          searchTerm={searchTerm}
          onSearchInput={handleSearchInput}
          onSearchSubmit={handleSearchSubmit}
        />

        <LastSearches urls={urls} onLastSearch={handleLastSearch} />
        </div>

        <NextPage 
          searchTerm={searchTerm}
          page={stories.page} 
          numberOfPages={stories.numberOfPages} 
          onNextPage = {handleNextPage}
          />
      </section>

      {stories.isError && <p>Something went wrong ...</p>}
      {stories.isLoading ? (
        <p>Loading...</p>
      ) : (
        <List 
          list={stories.data} 
          onRemoveItem={handleRemoveStory} />
      )}

    </div>
  );

};


export default App;

// Exported for file restructuring.
export type {Story, Stories};

