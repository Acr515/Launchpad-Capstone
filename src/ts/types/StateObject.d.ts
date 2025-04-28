type StateObject<T> = {
	value: T;
	set: React.Dispatch<React.SetStateAction<T>>;
};
export default StateObject;