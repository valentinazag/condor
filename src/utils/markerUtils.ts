export function getMarkerColor(magnitude: number | null): string {
	if (magnitude === null) return '#a0aec0';
	if (magnitude < 2) return '#F7F7F7';
	if (magnitude < 3) return '#DBDBDB';
	if (magnitude < 4) return '#BEC4D9';
	if (magnitude < 5) return '#A1D7E3';
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

export function buildPopupHTML(
	magnitude: number | null,
	place: string | null,
	time: number,
): string {
	const color = getMarkerColor(magnitude);
	const formattedTime = time
		? new Date(time).toLocaleString()
		: 'No date available';
	return `
        <div class="popup-content">        
            <h3 class="popup-title" style="color: ${color}">Magnitude: ${magnitude ?? 'No maginitude available'}</h3>
            <p class="popup-place">${place ?? 'No place available'}</p>
            <small class="popup-time">${formattedTime}</small>
        </div>
    `;
}
