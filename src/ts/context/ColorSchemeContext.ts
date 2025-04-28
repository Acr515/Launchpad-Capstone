import { createContext } from 'react';

export type ColorScheme = {
	primaryColor: string;
	secondaryColor: string;
	neutralColor: 'black' | 'white';
};

const ColorSchemeContext = createContext<ColorScheme>({
	primaryColor: '#fff',
	secondaryColor: '#bbb',
	neutralColor: 'black',
});

export default ColorSchemeContext;