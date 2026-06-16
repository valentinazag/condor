import * as v from 'valibot';
import type { EarthquakeWorkerMessage } from '../types/EarthquakeTypes';
import { EarthquakeSchema } from '../types/EarthquakeTypes';
import type { FilterParams } from '../types/FilterParams';

type WorkerScope = {
	onmessage: ((event: MessageEvent<FilterParams>) => void) | null;
	postMessage: (message: unknown) => void;
};

const workerSelf = self as unknown as WorkerScope;

workerSelf.onmessage = async (event: MessageEvent<FilterParams>) => {
	const { starttime, endtime, minmagnitude } = event.data;

	const params = new URLSearchParams({
		format: 'geojson',
		starttime,
		endtime,
		minmagnitude: minmagnitude.toString(),
	});

	const url = `https://earthquake.usgs.gov/fdsnws/event/1/query?${params.toString()}`;

	try {
		const response = await fetch(url);

		if (!response.ok) {
			const message =
				response.status === 400
					? 'Too many results or invalid filters. Try a shorter date range or higher magnitude.'
					: `Request failed: ${response.status}`;
			const msg: EarthquakeWorkerMessage = {
				earthquakes: null,
				error: message,
			};
			workerSelf.postMessage(msg);
			return;
		}

		const data = await response.json();
		const parsed = v.parse(EarthquakeSchema, data);
		const sorted = parsed.features.sort(
			(a, b) => (b.properties.mag ?? 0) - (a.properties.mag ?? 0),
		);
		const msg: EarthquakeWorkerMessage = { earthquakes: sorted, error: null };
		workerSelf.postMessage(msg);
	} catch (error) {
		const msg: EarthquakeWorkerMessage = {
			earthquakes: null,
			error: error instanceof Error ? error.message : 'Error in worker',
		};
		workerSelf.postMessage(msg);
	}
};
