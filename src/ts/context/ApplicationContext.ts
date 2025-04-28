import type Application from 'ts/classes/Application';
import { createContext } from 'react';

const ApplicationContext = createContext<Application | null>(null);
export default ApplicationContext;