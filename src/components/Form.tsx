import { useState } from 'react';
import '../App.css';
import type { SideBarProps } from '../types/SideBarProps';

export function Form({ onFilter }: SideBarProps) {
	const [starttime, setStarttime] = useState('');
	const [endtime, setEndtime] = useState('');
	const [minmagnitude, setMinmagnitude] = useState<number | string>('4');
	const [formError, setFormError] = useState<string | null>(null);
	const todayDate = new Date().toISOString().split('T')[0];

	function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setFormError(null);

		if (!starttime || !endtime) {
			setFormError('Both dates are required.');
			return;
		}

		if (new Date(starttime) > new Date(endtime)) {
			setFormError('Start date must be before end date.');
			return;
		}

		const endOfToday = new Date();
		if (new Date(endtime) > endOfToday) {
			setFormError('End date cannot be in the future.');
			return;
		}

		const magnitudeNum = minmagnitude === '' ? 4 : Number(minmagnitude);

		if (magnitudeNum < 0 || magnitudeNum > 10) {
			setFormError('Magnitude must be between 0 and 10.');
			return;
		}

		onFilter({ starttime, endtime, minmagnitude: magnitudeNum });
	}

	return (
		<form className="filter-form" onSubmit={handleSubmit}>
			<label className="filter-form__label">
				Start date
				<input
					type="date"
					className="filter-form__input"
					value={starttime}
					max={todayDate}
					onChange={(event) => setStarttime(event.target.value)}
				/>
			</label>
			<label className="filter-form__label">
				End date
				<input
					type="date"
					className="filter-form__input"
					value={endtime}
					max={todayDate}
					onChange={(event) => setEndtime(event.target.value)}
				/>
			</label>
			<label className="filter-form__label">
				Minimun magnitude
				<input
					type="number"
					className="filter-form__input"
					placeholder="4"
					value={minmagnitude}
					step={0.1}
					onChange={(event) => {
						const value = event.target.value;
						setMinmagnitude(value === '' ? '' : Number(value));
					}}
				/>
			</label>
			<button className="filter-form__button" type="submit">
				Search
			</button>
			{formError && <p className="filter-form__error">{formError}</p>}
		</form>
	);
}
