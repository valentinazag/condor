import { useEffect, useRef, useState } from 'react';
import type {
	EarthquakeFeature,
	EarthquakeWorkerMessage,
} from '../types/EarthquakeTypes';
import type { FilterParams } from '../types/FilterParams';

export function useEarthquakes(filters: FilterParams | null) {
	const [earthquakes, setEarthquakes] = useState<EarthquakeFeature[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);
	const [hasSearched, setHasSearched] = useState(false);
	const workerRef = useRef<Worker | null>(null);

	useEffect(() => {
		const worker = new Worker(
			new URL('../workers/earthquakeWorker.ts', import.meta.url),
			{ type: 'module' },
		);
		workerRef.current = worker;

		return () => {
			worker.terminate();
		};
	}, []);

	useEffect(() => {
		if (!filters) return;
		const worker = workerRef.current;
		if (!worker) return;

		setLoading(true);
		setError(null);

		function handleMessage(event: MessageEvent<EarthquakeWorkerMessage>) {
			const { earthquakes: data, error } = event.data;
			if (error) {
				setError(error);
			} else if (data) {
				setEarthquakes(data);
				setHasSearched(true);
			}
			setLoading(false);
		}

		function handleError(error: ErrorEvent) {
			setError(error.message || 'Worker error');
			setLoading(false);
		}

		worker.addEventListener('message', handleMessage);
		worker.addEventListener('error', handleError);

		worker.postMessage(filters);

		return () => {
			worker.removeEventListener('message', handleMessage);
			worker.removeEventListener('error', handleError);
		};
	}, [filters]);

	return { earthquakes, error, loading, hasSearched };
}
