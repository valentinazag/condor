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
		<form className="filter-form" onSubmit={handleSubmit}>
			<label className="filter-form__label">
				Start date
				<input
					type="date"
					className="filter-form__input"
					value={starttime}
					onChange={(event) => setStarttime(event.target.value)}
				/>
			</label>
			<label className="filter-form__label">
				End date
				<input
					type="date"
					className="filter-form__input"
					value={endtime}
					onChange={(event) => setEndtime(event.target.value)}
				/>
			</label>
			<label className="filter-form__label">
				Minimun magnitude
				<input
					type="number"
					className="filter-form__input"
					value={minmagnitude}
					min={0}
					max={10}
					step={0.1}
					onChange={(event) => setMinmagnitude(Number(event.target.value))}
				/>
			</label>
			<button className="filter-form__button" type="submit">
				Search
			</button>
		</form>
	);
}
