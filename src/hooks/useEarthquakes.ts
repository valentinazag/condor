import { useEffect, useState } from 'react';
import * as v from 'valibot';
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
type Earthquake = v.InferOutput<typeof EarthquakeSchema>['features'][number];

export function useEarthquakes(filters: FilterParams | null) {
	const [earthquakes, setEarthquakes] = useState<Earthquake[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const [hasSearched, setHasSearched] = useState(false);
	useEffect(() => {
		if (!filters) return;
		const { starttime, endtime, minmagnitude } = filters;
		const url = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${starttime}&endtime=${endtime}&minmagnitude=${minmagnitude}`;

		async function fetchEarthquakes() {
			setLoading(true);
			setError(null);
			try {
				const response = await fetch(url);
				if (!response.ok) {
					if (response.status === 400) {
						throw new Error(
							'Too many results or invalid filters. Try a shorter date range or higher magnitude.',
						);
					}
					throw new Error(`Request failed: ${response.status}`);
				}
				const data = await response.json();
				const parsed = v.parse(EarthquakeSchema, data);
				setHasSearched(true);
				setEarthquakes(parsed.features);
			} catch (error) {
				setError(error instanceof Error ? error.message : 'Error');
			} finally {
				setLoading(false);
			}
		}

		fetchEarthquakes();
	}, [filters]);

	return { earthquakes, error, loading, hasSearched };
}
