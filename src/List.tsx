import React from 'react';
import { sortBy } from 'lodash';

import {Story, Stories} from './App';

import { ReactComponent as Check } from './checkmark.svg';
import { ReactComponent as UpArrow } from './up-arrow.svg';
import { ReactComponent as DownArrow } from './down-arrow.svg';

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
  isReverse: boolean;
}

// From sort exercise and using instructor's solution since going forward,
// module assumes this solution.

// I don't think this is quite right, but the best I can figure, is that I
// needed to use an index signature?  

const SORTS: { [sortKey: string] : Stories | any } = {
  NONE: (list: Stories, isReverse: boolean) => list,
  TITLE: (list: Stories, isReverse: boolean) =>  sortBy(list, 'title'),
  AUTHOR: (list: Stories, isReverse: boolean) => sortBy(list, 'author'),
  COMMENT: (list: Stories, isReverse: boolean) => sortBy(list, 'num_comments').reverse(),
  POINT: (list: Stories, isReverse: boolean) => sortBy(list, 'points').reverse(),
};

// ====================================
// List
// ====================================

// Again using destructured objects - so props becomes {list, onRemoveItem}
// The wrapping 'div' added to fix a type safety issue -  see README or 
// module.

const List = ({list, onRemoveItem} : ListProps) => {

  const [sort, setSort] = React.useState({
    sortKey: 'NONE',
    isReverse: false,
  })

  const handleSort = (sortKey: string) => {
    const isReverse = sort.sortKey === sortKey && !sort.isReverse;

    // Since property name is the same as the variable name...
    // setSort({sortKey: sortKey, isReverse: isReverse});
    setSort({sortKey, isReverse});
  };

  const sortFunction = SORTS[sort.sortKey];
  const sortedList = sort.isReverse ? sortFunction(list).reverse() 
                                    : sortFunction(list);

  return (
    <>
    <SortButtons handleSort={handleSort} isReverse={sort.isReverse}/>
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
type buttonProp = {
  name: string;
  value: string;
  width: number;
}

type buttonProps = Array<buttonProp>;

const SortButtons = ( {handleSort, isReverse} : SortProps) => {
  
  // Addition of this index signature to allow for handling the current button
  // state.

  const buttonData: buttonProps = [
    {
      name: "Title",
      value: "TITLE",
      width: 40
    },
    {
      name: "Author",
      value: "AUTHOR",
      width: 30
    },
    {
      name: "Comments",
      value: "COMMENT",
      width: 10
    },
    {
      name: "Points",
      value: "POINT",
      width: 10
    }
  ];

  const [activeButton, setActiveButton] = React.useState(buttonData[0].name);
  
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {

    const button: HTMLButtonElement = e.currentTarget;
    const name = button.name;

    setActiveButton(name);
    handleSort(button.value);
  }

  return (
  <div>
    <div className={styles.sortButton}> 

    {
      buttonData.map( (item: buttonProp) => {

        let isActive = activeButton === item.name ? true : false;

        return (
          <React.Fragment key={item.value}>
            <span style={{ width: `${item.width}%`}}>
            
            <button
              className={`${styles.button} ${styles.buttonMedium}`}
              name={item.name}
              value={item.value}
              onClick={handleClick}
            >
              {item.name}&nbsp; 
              {
                isActive && (isReverse ? <UpArrow height="10px" width="10px" /> : 
                            <DownArrow height="10px" width="10px" />)
              }
            </button>
           
            </span>
            </React.Fragment>
        )
      }
    )}

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