import React from 'react';
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
}

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

export { Item };

export default List;