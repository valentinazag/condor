export const magnitudeScale = [
	{ label: 'No magnitud registered', color: '#090909' },
	{ label: 'Magnitude < 2', color: '#F7F7F7' },
	{ label: 'Magnitude 2 - 2.9', color: '#DBDBDB' },
	{ label: 'Magnitude 3 - 3.9', color: '#BEC4D9' },
	{ label: 'Magnitude 4 - 4.9', color: '#125d6e' },
	{ label: 'Magnitude 5 - 5.9', color: '#8FC891' },
	{ label: 'Magnitude 6 - 6.9', color: '#F9EB33' },
	{ label: 'Magnitude 7 - 7.9', color: '#F7C328' },
	{ label: 'Magnitude 8 - 8.9', color: '#E9872D' },
	{ label: 'Magnitude 9 - 9.9', color: '#F3653A' },
	{ label: 'Magnitude ≥ 10', color: '#ED5338' },
];

export function getMarkerColor(magnitude: number | null): string {
	if (magnitude === null) return '#090909';
	if (magnitude < 2) return '#F7F7F7';
	if (magnitude < 3) return '#DBDBDB';
	if (magnitude < 4) return '#BEC4D9';
	if (magnitude < 5) return '#125d6e';
	if (magnitude < 6) return '#8FC891';
	if (magnitude < 7) return '#F9EB33';
	if (magnitude < 8) return '#F7C328';
	if (magnitude < 9) return '#E9872D';
	if (magnitude < 10) return '#F3653A';
	return '#ED5338';
}

export function getMarkerSize(magnitude: number | null): number {
	if (magnitude == null) return 15;
	return Math.max(15, magnitude * 6);
}

const LIGHT_COLORS = new Set(['#F7F7F7', '#DBDBDB', '#BEC4D9']);

function getTextColor(markerColor: string): string {
	return LIGHT_COLORS.has(markerColor) ? '#000000' : markerColor;
}

export function buildPopupHTML(
	magnitude: number | null,
	place: string | null,
	time: number,
): string {
	const color = getMarkerColor(magnitude);
	const textColor = getTextColor(color);
	const formattedTime = time
		? new Date(time).toLocaleString()
		: 'No date available';
	return `
        <div class="popup__content">
            <h3 class="popup__title" style="color: ${textColor}">Magnitude: ${magnitude ?? 'No maginitude available'}</h3>
            <p class="popup__place">${place ?? 'No place available'}</p>
            <small class="popup__time">${formattedTime}</small>
        </div>
    `;
}
