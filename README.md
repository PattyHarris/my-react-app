# Notes

From the Educative module on React.  Note that this part of the module is available here:
https://github.com/the-road-to-learn-react

1. Arrow functions: we refactored from the 'function' declaration to this:
    ```
    const List = () => {
        return list.map( (item) => {
            return (
            <div key={item.objectID}> 
            <span>
                <a href={item.url}>{item.title}</a>
            </span>
            
            <span>{item.author}</span>
            <span>{item.num_comments}</span>
            <span>{item.points}</span>
            </div>
            );
        })
    }
    ```
Since List only returns something, we can refactor again to this - notice there are no curly braces used here - also (item) could be just 'item' since there is just one input parameter:
    ```
    const List = () => 
        list.map( (item) => (
            <div key={item.objectID}> 
            <span>
                <a href={item.url}>{item.title}</a>
            </span>
            
            <span>{item.author}</span>
            <span>{item.num_comments}</span>
            <span>{item.points}</span>
            </div>
    ) );

    ```

2. Good example of refactoring down to the minimal ES6 arrow function.  This bit of code is to filter the list based on the search term - using the 'filter' function:
   ```
   const searchedStories = stories.filter(function(story) {
       return story.title
       .toLowerCase()
       .includes(searchTerm.toLowerCase());
   })
   ```
   Next refactor to use a fat arrow:
   ```
    const searchedStories = stories.filter( (story) => {
       return story.title
       .toLowerCase()
       .includes(searchTerm.toLowerCase());
   }) 
   ```
   And finally, remove the 'return' since there's no other work being done:
   ```
    const searchedStories = stories.filter( (story) => (
       story.title.toLowerCase().includes(searchTerm.toLowerCase());
   ) 

   ```
3. Destructuring props: In the Search component, we're using props.value and props.onSearch.  This can be destructured like this:
   ```
    const Search = (props) => {

        // Destructured props - instead of props.value and props.onSearch
        const { search, onSearch } = props;

        return (
        <div>
            <label htmlFor='search'>Search: </label>
            <input 
                id="search" 
                type = "text" 
                value={search}
                onChange={onSearch} />
        </div>
    );
    }

   ```
   And again more precisely, destructure the props as input parameters:
   ```
    const Search = ({ search, onSearch }) => {
        return (
        ...
    }

   ```

4. useEffect: really good explanation: https://www.educative.io/module/page/wjB3xQCPvQgwjg7Vo/10370001/5432216462557184/5111428752605184

5. React hooks: We combined the useState and useEffect into a custom hook that, instead of being specific to search, can be used for any local data storage.  See also the link given for more reading: https://www.robinwieruch.de/react-hooks

6. Making the search component re-usable.  Started with this after much refactoring:
   ```
    const Search = ({ search, onSearch }) => {

        // Destructured props - instead of props.value and props.onSearch
        // const { search, onSearch } = props;

        // Using React fragments, there's no need for the 'return' or 'div'.
        <>
        <label htmlFor='search'>Search: </label>
        <input 
            id="search" 
            type = "text" 
            value={search}
            onChange={onSearch} />
        </>
    }
   ```

   From here, we ended up with a more re-usable bit of code:
   ```
    const InputWithLabel = ({ id, label, value, type='text', onInputChange }) => {

        // Destructured props - instead of props.value and props.onSearch
        // const { search, onSearch } = props;

        // Using React fragments, there's no need for the 'return' or 'div'.
        <>
        <label htmlFor={id}>{label}</label>
        &nbsp;
        <input 
            id={id} 

            type = {type} 
            value={value}

            onChange={onInputChange} 
        />
        </>
    }

   ```

7. Interesting way of handling the "Search:" aspect of the component - accessed using the 'children' attribute available as part of HTML.   See the courses github changes: https://github.com/the-road-to-learn-react/hacker-stories/compare/hs/Reusable-React-Component...hs/React-Component-Composition?expand=1

8. 