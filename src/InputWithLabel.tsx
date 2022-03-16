import React from 'react';
import styles from './App.module.css';

type InputWithLabelProps = {
    id: string;
    value: string;
    type?: string;
    onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    isFocused?: boolean;
    children: React.ReactNode;
}

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

export default InputWithLabel;