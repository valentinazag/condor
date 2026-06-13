import maplibregl from 'maplibre-gl';
import { useEffect, useRef } from 'react';
import 'maplibre-gl/dist/maplibre-gl.css';
import * as v from 'valibot';
import '../App.css';
import type { FilterParams } from '../types/FilterParams';

const EarthquakeSchema = v.object({
	features: v.array(
		v.object({
			properties: v.object({
				mag: v.nullable(v.number()),
				place: v.nullable(v.string()),
				time: v.number(),
			}),
			geometry: v.object({
				coordinates: v.tuple([v.number(), v.number(), v.number()]),
			}),
		}),
	),
});

type MapContainerProps = {
	filters: FilterParams | null;
};

export function MapContainer({ filters }: MapContainerProps) {
	const mapContainer = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!filters) return;
		const { starttime, endtime, minmagnitude } = filters;
		const url = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${starttime}&endtime=${endtime}&minmagnitude=${minmagnitude}`;

		async function fetchEarthquakes() {
			const response = await fetch(url);
			const data = await response.json();
			const parsedData = v.parse(EarthquakeSchema, data);
			console.log(
				'earthquakes:',
				parsedData.features.map((f) => ({
					...f.properties,
					date: new Date(f.properties.time).toISOString(),
					latitude: f.geometry.coordinates[1],
					longitude: f.geometry.coordinates[0],
					depth: f.geometry.coordinates[2],
				})),
			);
		}

		fetchEarthquakes();
	}, [filters]);

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

	return <div ref={mapContainer} className="map-style" />;
}
