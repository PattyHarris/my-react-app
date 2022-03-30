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

8. Typescript: Adding typescript to the problem brought out some errors not covered by the instructor:
   1. I left in the styling using CSS modules.  This is fix (maybe) using this links: https://duncanleung.com/typescript-module-declearation-svg-img-assets/ and https://spin.atomicobject.com/2020/06/22/css-module-typescript/.  First we need to install this plugin which showed a number of deprecations:
   ```
   npm install typescript-plugin-css-modules --save-dev
   ```
   Adding an styles.d.ts file:
   ```
   declare module "*.module.css" {
    const classes: { [key: string]: string };
    export default classes;
  }
   ```
   2. Secondly, Typescript didn't understand the SVG file - here another file, custom.d.ts fixed that issue:
   ```
   declare module "\*.svg" {
    import React = require("react");
    export const ReactComponent: React.SFC<React.SVGProps<SVGSVGElement>>;
    const src: string;
    export default src;
  }
   ```
   3. The following was added to the VSCode settings.json file (first one had been added before):
   ```
    "typescript.tsdk": "./node_modules/typescript/lib",
    "typescript.enablePromptUseWorkspaceTsdk": true,
   ```
9. The course doesn't seem to need to init Typescript - I needed to run "tsc init" to generate the tsconfig.json file.
10. As part of the Typescript changes, a wrapping 'div' had to be added to the List - from the module: According to a TypeScript with React issue on GitHub: “This is because due to limitations in the compiler, function components cannot return anything other than a JSX expression or null, otherwise it complains with a cryptic error message saying that the other type is not assignable to Element.”
11. See this github for a great Typescript cheat sheet: https://github.com/typescript-cheatsheets/react#reacttypescript-cheatsheets
12. See this link for some other fixes I needed to make to get rid of compile errors that the module didn't need to make: https://dev-yakuza.posstree.com/en/react/create-react-app/typescript/
13. See this link regarding Typescript, Jest, and axios: https://www.fullstacklabs.co/blog/testing-async-requests-from-react-hooks
14. Adding sort:  The tricky part here was really understanding how the interfaces and types in the App interact.  Also getting the Typescript correct for function parameters and callbacks was a useful exercise.  See the github changes.  The only sort that doesn't seem to work is that for 'author'.  I'm not sure how it's sorting that column of data.
15. Note that sortBy (as suggested by the instructor) does not have a sort direction, but orderBy does.  Also, you need to explicitly pass 'asc' or 'desc'.  Stupid.
16. Added a dictionary in List to hold the button sort type and the direction.  This function also then calls the callback in the App where the sorting occurs.  Question is whether the state of the list belongs in List or the App.  Dunno.  Checking in at this point before I look at the solution.
17. Since the course is moving forward with the solution given, I've replaced my changes with the course changes...
18. When adding reverse using the instructors solution (since going forward, it assumes that you are), an additional exercise was to show which button was sorted and in which direction.  Basically, it boils down to determining the active button.  I used an SO article that helped figure out the active button, but again had to translate to typescript.   The logic to show or not show the arrow seems to work.  See https://stackoverflow.com/questions/61348213/how-to-change-background-color-of-button-using-react for more information.
19. Segue-way: Medium article on using absolute https://medium.com/geekculture/making-life-easier-with-absolute-imports-react-in-javascript-and-typescript-bbdab8a8a3a1  Seems to work.
20. Adding the last 5 searches accessible with buttons: I used the buttons as the search and letting the button text show the last search.  The idea is to re-use the 'url' and 'setUrl' states.  The current commit is my solution.  I'll check the instructor's solution next.
21. My solution nearly follows the instructor's solution, with a few refinements.  See commit differences.
22. Exercise is to show unique searches on the buttons which also are not to include the current search.  These 2 items are complete.  The last item is to change the input text based on the button click.  I have not seen a way to do this and so I will check the solution.  Moving right along.
23. To set the search term in the input text, all that is needed is to use 'setSearchTerm' - duh!
24. Last exercise is to add the ability to page forward in the results.  I wanted to make the 'next page' button align with the search input area - used 'flex'.  The main issue was figuring out why the 'next page' button was sizing up the the flex area - setting margin-bottom to 'auto' fixed this.  
25. As part of the 'next page' exercise, the components have been refactored into their own files - much cleaner.