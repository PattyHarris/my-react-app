import React from 'react';

import renderer from 'react-test-renderer';
import App from './App';

import InputWithLabel from './InputWithLabel';
import List, { Item } from './List';
import SearchForm from './SearchForm';

// For App tests.
import axios from 'axios';
jest.mock('axios');

//========================================
// Item
//========================================
describe('Item', () => {
  const item = {
    title: 'React',
    url: 'https://reactjs.org/',
    author: 'Jordan Walke',
    num_comments: 3,
    points: 4,
    objectID: '0',
  };

  const handleRemoveItem = jest.fn();
  
  let component: any;

  beforeEach(() => {
    component = renderer.create(
      <Item item={item} onRemoveItem={handleRemoveItem} />
    );
  });

  // This has all been tweaked for Typescript...
  it('renders all properties', async () => {

    const anchor = await component.root.findByType('a');
    expect(anchor.props.href).toEqual( 'https://reactjs.org/');

    const allChildren = await component.root.findAllByProps({ children: 'Jordan Walke' });
    expect(allChildren.length).toEqual(1);
  });

  it('calls onRemoveItem on button click', async () => {

    const someButton = await component.root.findByType('button');
    someButton.props.onClick();

    expect(handleRemoveItem).toHaveBeenCalledTimes(1);
    expect(handleRemoveItem).toHaveBeenCalledWith(item);

    const itemType = await component.root.findAllByType(Item);
    expect(itemType.length).toEqual(1);
  });

  // Example of a snapshot test.
  test('renders snapshot', () => {
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});

//========================================
// List
//========================================
describe('List', () => {
  const list = [
    {
      title: 'React',
      url: 'https://reactjs.org/',
      author: 'Jordan Walke',
      num_comments: 3,
      points: 4,
      objectID: '0',
    },
    {
      title: 'Redux',
      url: 'https://redux.js.org/',
      author: 'Dan Abramov, Andrew Clark',
      num_comments: 2,
      points: 5,
      objectID: '1',
    },
  ];
  const handleRemoveItem = jest.fn();

  it('renders two items', async () => {
    const component = renderer.create(<
        List list={list} 
        onRemoveItem={handleRemoveItem} 
      />);

    const itemByType = await component.root.findAllByType(Item);
    expect(itemByType.length).toEqual(2);
  });
});

//========================================
// SearchForm and InputWithLabel
//========================================
describe('SearchForm', () => {
  const searchFormProps = {
    searchTerm: 'React',
    urls: ['React'],
    onSearchInput: jest.fn(),
    onSearchSubmit: jest.fn(),
    onLastSearch: jest.fn()
  };

  let component: any;

  beforeEach(() => {
    component = renderer.create(<SearchForm {...searchFormProps} />);
  });

  it('renders the input field with its value', async () => {
    const inputLabel = await component.root.findByType(InputWithLabel);
    const value = inputLabel.props.value;

    expect(value).toEqual('React');
  });

  it('changes the input field', async () => {

    const pseudoEvent = { target: 'Redux' };

    const inputField = await component.root.findByType('input');
    inputField.props.onChange(pseudoEvent);

    expect(searchFormProps.onSearchInput).toHaveBeenCalledTimes(1);
    expect(searchFormProps.onSearchInput).toHaveBeenCalledWith(
      pseudoEvent
    );
  });

  it('submits the form', async () => {
    
    const pseudoEvent = {};

    const form = await component.root.findByType('form');
    form.props.onSubmit(pseudoEvent);

    expect(searchFormProps.onSearchSubmit).toHaveBeenCalledTimes(1);
    expect(searchFormProps.onSearchSubmit).toHaveBeenCalledWith(
      pseudoEvent
    );
  });

  it('disables the button and prevents submit', async () => {
    component.update(
      <SearchForm {...searchFormProps} searchTerm="" />
    );

    const button = await component.root.findByType('button');
    expect(button.props.disabled).toBeTruthy();
  });
});

//========================================
// App
//========================================
describe('App', () => {

  it('succeeds fetching data with a list', async () => {
    
    const list = [
      {
        title: 'React',
        url: 'https://reactjs.org/',
        author: 'Jordan Walke',
        num_comments: 3,
        points: 4,
        objectID: 0,
      },
      {
        title: 'Redux',
        url: 'https://redux.js.org/',
        author: 'Dan Abramov, Andrew Clark',
        num_comments: 2,
        points: 5,
        objectID: 1,
      },
    ];

    const promise = Promise.resolve({
      data: {
        hits: list,
      },
    });

    (axios.get as jest.Mock).mockImplementationOnce(() => promise);
    
    let component: any;

    await renderer.act(async () => {
      component = renderer.create(<App />);
    });

    const findList = await component.root.findByType(List);
    expect(findList.props.list).toEqual(list);
  });

  // Unhappy path.
  it('fails fetching data with a list', async () => {
    
    const promise = Promise.reject();

    (axios.get as jest.Mock).mockImplementationOnce(() => promise);

    let component: any;

    await renderer.act(async () => {
      component = renderer.create(<App />);
    });

    const paragraph = await component.root.findByType('p');
    expect(paragraph.props.children).toEqual(
      'Something went wrong ...'
    );
  });

});