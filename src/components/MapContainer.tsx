import maplibregl from 'maplibre-gl';
import { useEffect, useRef } from 'react';
import 'maplibre-gl/dist/maplibre-gl.css';
import '../App.css';
import { useEarthquakes } from '../hooks/useEarthquakes';
import type { FilterParams } from '../types/FilterParams';

type MapContainerProps = {
	filters: FilterParams | null;
	sidebarOpen: boolean;
};

export function MapContainer({ filters, sidebarOpen }: MapContainerProps) {
	const mapContainer = useRef<HTMLDivElement>(null);
	const mapRef = useRef<maplibregl.Map | null>(null);
	const { earthquakes, loading, error } = useEarthquakes(filters);
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
		if (!mapRef.current || earthquakes.length === 0) return;
		markersRef.current.forEach((marker) => {
			marker.remove();
		});
		markersRef.current = [];

		earthquakes.forEach((feature) => {
			const [longitude, latitude] = feature.geometry.coordinates;
			const { place, mag: magnitude, time } = feature.properties;
			let color = '#a0aec0';
			let size = 15;
			if (magnitude !== null) {
				size = Math.max(15, magnitude * 6);

				if (magnitude < 3) {
					color = '#22c55e';
				} else if (magnitude < 5) {
					color = '#eab308';
				} else if (magnitude < 7) {
					color = '#f97316';
				} else {
					color = '#ef4444';
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
		<>
			<div
				ref={mapContainer}
				className={`map-style ${sidebarOpen ? 'map-style--sidebar-open' : ''}`}
			/>
			{loading && <p>Loading...</p>}
			{error && <p>Error: {error}</p>}
			<div ref={mapContainer} className="map-style" />
		</>
	);
}
