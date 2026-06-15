import '../App.css';
import type { SideBarProps } from '../types/SideBarProps';
import { Form } from './Form';

export default function SideBar({ onFilter, isOpen, onToggle }: SideBarProps) {
	return (
		<aside
			className={`side-bar ${isOpen ? 'side-bar--open' : 'side-bar--closed'}`}
		>
			<button type="button" className="side-bar__toggle" onClick={onToggle}>
				{isOpen ? '◀' : '▶'}
			</button>
			<div className="side-bar__content">
				<h2 className="side-bar__title">Filter earthquakes data!</h2>
				<Form onFilter={onFilter} />
			</div>
		</aside>
	);
}
