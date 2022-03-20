import React from 'react';
import axios from 'axios';
import { orderBy } from 'lodash';

import styles from './App.module.css';

import List from './List';
import SearchForm from './SearchForm';

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

type StoriesState = {
  data: Stories;
  isLoading: boolean;
  isError: boolean;
};

interface StoriesFetchInitAction {
  type: 'STORIES_FETCH_INIT';
};

interface StoriesFetchSuccessAction {
  type: 'STORIES_FETCH_SUCCESS';
  payload: Stories;
};

interface StoriesFetchFailureAction {
  type: 'STORIES_FETCH_FAILURE';
};

interface StoriesRemoveAction {
  type: 'REMOVE_STORY';
  payload: Story;
};

// Here, type is the sort type (e.g. points, author, etc.)
interface StoriesSortAction {
  type: 'STORIES_SORT';
  payload: {
    type: string;
    direction: string;
    stories: Stories;
  };
};

type StoriesAction =
  | StoriesFetchInitAction
  | StoriesFetchSuccessAction
  | StoriesFetchFailureAction
  | StoriesRemoveAction
  | StoriesSortAction;

// ====================================
// Sort State
// ====================================

type SortState = {
  type: string;
  direction: string;
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
       case 'STORIES_SORT':
        {
          console.log(action);
          return {
            ...state,
            data: orderBy(
                action.payload.stories, 
                [action.payload.type], 
                [action.payload.direction === "asc" ? "asc" : "desc"])
          };
         }
    default:
      throw new Error();
  }
};

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
  const [url, setURl] = React.useState(
    `${API_ENDPOINT}${searchTerm}`
  );
  
  //------------------------
  const [stories, dispatchStories] = React.useReducer(
    storiesReducer,
    { data: [], isLoading: false, isError: false }
  );

  //------------------------
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
    setURl(`${API_ENDPOINT}${searchTerm}`);
    event.preventDefault();
  };

  //------------------------
  const handleSortList = (
    sort: SortState
  ) => {
    dispatchStories({
      type: 'STORIES_SORT',
      payload: {type: sort.type, direction: sort.direction, stories: stories.data}
    });
  };

  //------------------------
  //------------------------
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
        <List 
          list={stories.data} 
          onRemoveItem={handleRemoveStory} 
          onSortList={handleSortList} />
      )}

    </div>
  );

};


export default App;

// Exported for file restructuring.
export type {Story, Stories, SortState};

