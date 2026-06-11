import maplibregl from 'maplibre-gl';
import { useEffect, useRef } from 'react';
import 'maplibre-gl/dist/maplibre-gl.css';
import './App.css';
import SideBar from '../src/components/sidebar';

function App() {
	const mapContainer = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!mapContainer.current) return;

		const map = new maplibregl.Map({
			container: mapContainer.current,
			style: 'https://tiles.openfreemap.org/styles/liberty',
			center: [0, 0],
			zoom: 2,
		});

		return () => map.remove();
	}, []);

	return (
		<>
			<div ref={mapContainer} className="map-style" />
			<SideBar />
		</>
	);
}

export default App;
