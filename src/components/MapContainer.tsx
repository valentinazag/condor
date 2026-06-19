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

const INITIAL_CENTER: [number, number] = [0, 0];
const INITIAL_ZOOM = 2;

export function MapContainer({ filters, isDarkMode }: MapContainerProps) {
	const mapContainer = useRef<HTMLDivElement>(null);
	const mapRef = useRef<maplibregl.Map | null>(null);
	const { earthquakes, loading, error, hasSearched, limited } =
		useEarthquakes(filters);
	const markersRef = useRef<maplibregl.Marker[]>([]);
	const isMounted = useRef(false);
	const homeCenterRef = useRef<[number, number]>(INITIAL_CENTER);
	const homeZoomRef = useRef(INITIAL_ZOOM);

	useEffect(() => {
		if (!mapContainer.current) return;

		mapRef.current = new maplibregl.Map({
			container: mapContainer.current,
			style: 'https://tiles.openfreemap.org/styles/liberty',
			center: INITIAL_CENTER,
			zoom: INITIAL_ZOOM,
			pitchWithRotate: false,
		});

		const map = mapRef.current;

		navigator.geolocation.getCurrentPosition(
			(position) => {
				const center: [number, number] = [
					position.coords.longitude,
					position.coords.latitude,
				];
				homeCenterRef.current = center;
				homeZoomRef.current = 3;
				map.flyTo({ center, zoom: 3, duration: 1500 });
			},
			() => {},
		);

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
			const { place, mag: magnitude, time, url } = feature.properties;

			const color = getMarkerColor(magnitude);
			const size = getMarkerSize(magnitude);

			const markerEl = document.createElement('div');
			markerEl.className = 'custom-marker';
			markerEl.style.backgroundColor = color;
			markerEl.style.width = `${size}px`;
			markerEl.style.height = `${size}px`;
			markerEl.addEventListener('click', () => {
				map.flyTo({
					center: [longitude, latitude],
					zoom: Math.max(map.getZoom(), 10),
					duration: 1200,
					essential: true,
				});
			});

			const marker = new maplibregl.Marker({ element: markerEl })
				.setLngLat([longitude, latitude])
				.setPopup(
					new maplibregl.Popup({ offset: size / 2 }).setHTML(
						buildPopupHTML(magnitude, place, time, url),
					),
				)
				.addTo(map);

			markersRef.current.push(marker);
		});
	}, [earthquakes]);

	function handleResetZoom() {
		mapRef.current?.flyTo({
			center: homeCenterRef.current,
			zoom: homeZoomRef.current,
			bearing: 0,
			pitch: 0,
		});
	}

	return (
		<div className="map-root">
			<div ref={mapContainer} className="map-style" />
			<button
				type="button"
				className="map-reset-btn"
				onClick={handleResetZoom}
				title="Reset view"
			>
				<svg
					viewBox="0 0 24 24"
					width="16"
					height="16"
					fill="none"
					stroke="currentColor"
					strokeWidth="2"
					strokeLinecap="round"
				>
					<title>Reset view</title>
					<circle cx="12" cy="12" r="9" />
					<line x1="12" y1="3" x2="12" y2="21" />
					<line x1="3" y1="12" x2="21" y2="12" />
				</svg>
			</button>
			{loading && (
				<div className="map-overlay">
					<div className="map-overlay__spinner" />
					<p className="map-overlay__text">Loading earthquakes...</p>
				</div>
			)}
			{hasSearched && !loading && earthquakes.length > 0 && !limited && (
				<div className="map-results-badge">
					{earthquakes.length} earthquakes found
				</div>
			)}
			{limited && !loading && (
				<div className="map-limit-banner">
					Showing 500 results — Narrow your search for complete data.
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
