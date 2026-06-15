import '../App.css';
import type { SideBarProps } from '../types/SideBarProps';
import { legendItems } from '../utils/markerUtils';
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
				<div className="sidebar-legend">
					<h3 className="sidebar-legend__title">Magnitude Colors</h3>
					<div className="sidebar-legend__grid">
						{legendItems.map((item) => (
							<div key={item.label} className="sidebar-legend__item">
								<span
									className="sidebar-legend__dot"
									style={{ backgroundColor: item.color }}
								/>
								<span className="sidebar-legend__label">{item.label}</span>
							</div>
						))}
					</div>
				</div>
			</div>
		</aside>
	);
}
