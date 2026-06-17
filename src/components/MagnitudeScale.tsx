import { magnitudeScale } from '../utils/markerUtils';
export function MagnitudeScale() {
	return (
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
	);
}
