import React from 'react';
import {Story, Stories, SortState} from './App';

import { ReactComponent as Check } from './checkmark.svg';
import styles from './App.module.css';

type ListProps = {
  list: Stories;
  onRemoveItem: (item: Story) => void;
  onSortList: (sort: SortState) => void;
};

type ItemProps = {
  item: Story;
  onRemoveItem: ( item: Story ) => void;
};

type SortProps = {
  onSortList: (sort: SortState) => void;
};

let sortButtonStates: Record<string, string> = 
  {
    "title": "asc",
    "author": "asc",
    "num_comments": "asc",
    "points": "asc"
  }


// ====================================
// List
// ====================================

// Again using destructured objects - so props becomes {list, onRemoveItem}
// The wrapping 'div' added to fix a type safety issue -  see README or 
// module.

const List = ({list, onRemoveItem, onSortList} : ListProps) => (
  <>
  <SortButtons onSortList={onSortList} />
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
// Sort buttons
// ====================================
const handleSortButton = ({ onSortList } : SortProps, type: string ) => {
  console.log(sortButtonStates[type]);

  let direction: string = sortButtonStates[type];
  if (direction === "asc") {
    direction = "desc";
  }
  else {
    direction = "asc";
  }

  sortButtonStates[type] = direction;
  onSortList({type, direction});
}

const SortButtons = ( { onSortList } : SortProps ) => {

  return (
  <div>
    <div className={styles.sortButton}> 

      <span style={{ width: '40%'}}>
        <button 
          type='button' 
          className={`${styles.button} ${styles.buttonLarge}`}
          onClick={ () => handleSortButton({onSortList}, "title")} >
          Title
        </button>
      </span>

    <span style={{ width: '30%'}}>
    <button 
        type='button' 
        className={`${styles.button} ${styles.buttonLarge}`}
        onClick={ () => handleSortButton({onSortList}, "author") } >
        Author
      </button>
    </span>

    <span style={{ width: '10%'}}>
    <button 
        type='button' 
        className={`${styles.button} ${styles.buttonLarge}`}
        onClick={ () => handleSortButton({onSortList}, "num_comments") } >
        Comments
      </button>
    </span>

    <span style={{ width: '10%'}}>
    <button 
        type='button' 
        className={`${styles.button} ${styles.buttonLarge}`}
        onClick={ () => handleSortButton({onSortList}, "points") } >
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