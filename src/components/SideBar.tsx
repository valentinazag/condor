import '../App.css';
import type { SideBarProps } from '../types/SideBarProps';
import { magnitudeScale } from '../utils/markerUtils';
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
				<div className="side-bar__legend">
					<h3 className="side-bar__legend-title">Magnitude Colors</h3>
					<div className="side-bar__legend-grid">
						{magnitudeScale.map((item) => (
							<div key={item.label} className="side-bar__legend-item">
								<span
									className="side-bar__legend-dot"
									style={{ backgroundColor: item.color }}
								/>
								<span className="side-bar__legend-label">{item.label}</span>
							</div>
						))}
					</div>
				</div>
			</div>
		</aside>
	);
}
