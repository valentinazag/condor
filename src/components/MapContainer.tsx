import maplibregl from 'maplibre-gl';
import { useEffect, useRef } from 'react';
import 'maplibre-gl/dist/maplibre-gl.css';
import '../App.css';
import { useEarthquakes } from '../hooks/useEarthquakes';
import type { MapContainerProps } from '../types/MapContainerProps';

export function MapContainer({ filters }: MapContainerProps) {
	const mapContainer = useRef<HTMLDivElement>(null);
	const mapRef = useRef<maplibregl.Map | null>(null);
	const { earthquakes, loading, error, hasSearched } = useEarthquakes(filters);
	const markersRef = useRef<maplibregl.Marker[]>([]);
	useEffect(() => {
		if (!mapContainer.current) return;

		mapRef.current = new maplibregl.Map({
			container: mapContainer.current,
			style: 'https://tiles.openfreemap.org/styles/liberty',
			center: [0, 0],
		});
		return () => mapRef.current?.remove();
	}, []);

	useEffect(() => {
		markersRef.current.forEach((m) => {
			m.remove();
		});
		markersRef.current = [];

		const map = mapRef.current;
		if (!map || earthquakes.length === 0) return;

		earthquakes.forEach((feature) => {
			const [longitude, latitude] = feature.geometry.coordinates;
			const { place, mag: magnitude, time } = feature.properties;
			let color = '#a0aec0';
			let size = 15;
			if (magnitude !== null) {
				size = Math.max(15, magnitude * 6);

				if (magnitude < 2) {
					color = '#F7F7F7';
				} else if (magnitude < 3) {
					color = '#DBDBDB';
				} else if (magnitude < 4) {
					color = '#BEC4D9';
				} else if (magnitude < 5) {
					color = '#A1D7E3';
				} else if (magnitude < 6) {
					color = '#8FC891';
				} else if (magnitude < 7) {
					color = '#F9EB33';
				} else if (magnitude < 8) {
					color = '#F7C328';
				} else if (magnitude < 9) {
					color = '#E9872D';
				} else if (magnitude < 10) {
					color = '#F3653A';
				} else {
					color = '#ED5338';
				}
			}

			const el = document.createElement('div');
			el.className = 'custom-marker';
			el.style.backgroundColor = color;
			el.style.width = `${size}px`;
			el.style.height = `${size}px`;

			const formattedTime = time
				? new Date(time).toLocaleString()
				: 'No date available';
			const popupContent = `
            <div style="font-family: sans-serif; padding: 5px;">
                <h3 style="margin: 0 0 5px 0; color: ${color};">Magnitude: ${magnitude ?? 'No magnitude available'}</h3>
                <p style="margin: 0 0 5px 0; font-weight: bold;">${place ?? 'No place available'}</p>
                <small style="color: #666;">${formattedTime}</small>
            </div>
        `;

			const marker = new maplibregl.Marker({ element: el })
				.setLngLat([longitude, latitude])
				.setPopup(
					new maplibregl.Popup({ offset: size / 2 }).setHTML(popupContent),
				)
				.addTo(mapRef.current!);
			markersRef.current.push(marker);
		});
	}, [earthquakes]);

	return (
		<div style={{ position: 'fixed', inset: 0 }}>
			<div ref={mapContainer} className="map-style" />
			{loading && (
				<div className="map-overlay">
					<div className="map-overlay__spinner" />
					<p className="map-overlay__text">Loading earthquakes...</p>
				</div>
			)}
			{hasSearched && !loading && earthquakes.length === 0 && (
				<div className="map-overlay">
					<p className="map-overlay__text">
						No earthquakes found for the selected filters.
					</p>
				</div>
			)}
			{error && (
				<div className="map-overlay map-overlay--error">
					<p>{error}</p>
				</div>
			)}
		</div>
	);
}
