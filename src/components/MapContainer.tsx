import maplibregl from 'maplibre-gl';
import { useEffect, useRef } from 'react';
import 'maplibre-gl/dist/maplibre-gl.css';
import '../App.css';
import { useEarthquakes } from '../hooks/useEarthquakes';
import type { FilterParams } from '../types/FilterParams';
import {
	buildPopupHTML,
	getMarkerColor,
	getMarkerSize,
} from '../utils/markerUtils';

type MapContainerProps = {
	filters: FilterParams | null;
	isDarkMode: boolean;
};

export function MapContainer({ filters, isDarkMode }: MapContainerProps) {
	const mapContainer = useRef<HTMLDivElement>(null);
	const mapRef = useRef<maplibregl.Map | null>(null);
	const { earthquakes, loading, error, hasSearched } = useEarthquakes(filters);
	const markersRef = useRef<maplibregl.Marker[]>([]);
	const isMounted = useRef(false);

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
		if (!isMounted.current) {
			isMounted.current = true;
			return;
		}
		const map = mapRef.current;
		if (!map) return;

		const newStyle = isDarkMode
			? 'https://tiles.openfreemap.org/styles/dark'
			: 'https://tiles.openfreemap.org/styles/liberty';

		map.setStyle(newStyle);
	}, [isDarkMode]);

	useEffect(() => {
		markersRef.current.forEach((marker) => {
			marker.remove();
		});
		markersRef.current = [];

		const map = mapRef.current;
		if (!map || earthquakes.length === 0) return;

		earthquakes.forEach((feature) => {
			const [longitude, latitude] = feature.geometry.coordinates;
			const { place, mag: magnitude, time } = feature.properties;

			const color = getMarkerColor(magnitude);
			const size = getMarkerSize(magnitude);

			const markerEl = document.createElement('div');
			markerEl.className = 'custom-marker';
			markerEl.style.backgroundColor = color;
			markerEl.style.width = `${size}px`;
			markerEl.style.height = `${size}px`;

			const marker = new maplibregl.Marker({ element: markerEl })
				.setLngLat([longitude, latitude])
				.setPopup(
					new maplibregl.Popup({ offset: size / 2 }).setHTML(
						buildPopupHTML(magnitude, place, time),
					),
				)
				.addTo(map);

			markersRef.current.push(marker);
		});
	}, [earthquakes]);

	return (
		<div className="map-root">
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
