import { useState } from 'react';
import '../App.css';
import type { SideBarProps } from '../types/SideBarProps';

export function Form({ onFilter }: SideBarProps) {
	const [starttime, setStarttime] = useState('');
	const [endtime, setEndtime] = useState('');
	const [minmagnitude, setMinmagnitude] = useState(4);

	function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		onFilter({ starttime, endtime, minmagnitude });
	}

	return (
		<form onSubmit={handleSubmit}>
			<input
				type="date"
				name="starttime"
				id="starttime"
				className="filter"
				value={starttime}
				onChange={(event) => setStarttime(event.target.value)}
			/>
			<input
				type="date"
				name="endtime"
				id="endtime"
				className="filter"
				value={endtime}
				onChange={(event) => setEndtime(event.target.value)}
			/>
			<input
				type="number"
				name="minmagnitude"
				id="minmagnitude"
				className="filter"
				value={minmagnitude}
				onChange={(event) => setMinmagnitude(Number(event.target.value))}
			/>
			<button type="submit">Search</button>
		</form>
	);
}
