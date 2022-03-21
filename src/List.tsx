import React from 'react';
import { sortBy } from 'lodash';

import {Story, Stories} from './App';

import { ReactComponent as Check } from './checkmark.svg';
import styles from './App.module.css';


type ListProps = {
  list: Stories;
  onRemoveItem: (item: Story) => void;
};

type ItemProps = {
  item: Story;
  onRemoveItem: ( item: Story ) => void;
};

type SortProps = {
  handleSort: (sortKey: string) => void;
}

// From sort exercise and using instructor's solution since going forward,
// module assumes this solution.

// I don't think this is quite right, but the best I can figure, is that I
// needed to use an index signature?  

const SORTS: { [sort: string] : any } = {
  NONE: (list: Stories) => list,
  TITLE: (list: Stories) => sortBy(list, 'title'),
  AUTHOR: (list: Stories) => sortBy(list, 'author'),
  COMMENT: (list: Stories) => sortBy(list, 'num_comments').reverse(),
  POINT: (list: Stories) => sortBy(list, 'points').reverse(),
};

// ====================================
// List
// ====================================

// Again using destructured objects - so props becomes {list, onRemoveItem}
// The wrapping 'div' added to fix a type safety issue -  see README or 
// module.

const List = ({list, onRemoveItem} : ListProps) => {

  const [sort, setSort] = React.useState('NONE');

  const handleSort = (sortKey: string) => {
    setSort(sortKey);
  };

  const sortFunction = SORTS[sort];
  const sortedList = sortFunction(list);

  return (
  <>
  <SortButtons handleSort={handleSort} />
  { sortedList.map((item: Story) => (
    <Item 
      key={item.objectID} 
      item={item}
      onRemoveItem={onRemoveItem}
      />
    ))}
    </>
)};

// ====================================
// Sort buttons
// ====================================

const SortButtons = ( {handleSort} : SortProps ) => {

  return (
  <div>
    <div className={styles.sortButton}> 

      <span style={{ width: '40%'}}>
        <button 
          type='button' 
          className={`${styles.button} ${styles.buttonLarge}`}
          onClick={ () => handleSort('TITLE')} >
          Title
        </button>
      </span>

    <span style={{ width: '30%'}}>
    <button 
        type='button' 
        className={`${styles.button} ${styles.buttonLarge}`}
        onClick={ () => handleSort('AUTHOR') } >
        Author
      </button>
    </span>

    <span style={{ width: '10%'}}>
    <button 
        type='button' 
        className={`${styles.button} ${styles.buttonLarge}`}
        onClick={ () => handleSort('COMMENT') } >
        Comments
      </button>
    </span>

    <span style={{ width: '10%'}}>
    <button 
        type='button' 
        className={`${styles.button} ${styles.buttonLarge}`}
        onClick={ () => handleSort('POINT') } >
        Points
      </button>
    </span>

    <span style={{ width: '10%'}}></span>
    </div>

  </div>
)};

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

export { Item };

export default List;