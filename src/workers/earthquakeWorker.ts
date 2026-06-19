import * as v from 'valibot';
import type { EarthquakeWorkerMessage } from '../types/EarthquakeTypes';
import { EarthquakeSchema } from '../types/EarthquakeTypes';
import type { FilterParams } from '../types/FilterParams';

type WorkerRequest = FilterParams & { requestId: number };

const RESULT_LIMIT = 500;

type WorkerScope = {
	onmessage: ((event: MessageEvent<WorkerRequest>) => void) | null;
	postMessage: (message: unknown) => void;
};

const workerSelf = self as unknown as WorkerScope;

workerSelf.onmessage = async (event: MessageEvent<WorkerRequest>) => {
	const { starttime, endtime, minmagnitude, requestId } = event.data;

	const params = new URLSearchParams({
		format: 'geojson',
		starttime,
		endtime,
		minmagnitude: minmagnitude.toString(),
		limit: RESULT_LIMIT.toString(),
	});

	const url = `https://earthquake.usgs.gov/fdsnws/event/1/query?${params.toString()}`;

	try {
		const response = await fetch(url);

		if (!response.ok) {
			const message =
				response.status === 400
					? 'Invalid filters. Please check the date range and magnitude values.'
					: `Request failed: ${response.status}`;
			const msg: EarthquakeWorkerMessage = {
				requestId,
				earthquakes: null,
				error: message,
				limited: false,
			};
			workerSelf.postMessage(msg);
			return;
		}

		const data = await response.json();
		const parsed = v.parse(EarthquakeSchema, data);
		const sorted = parsed.features.sort(
			(a, b) => (b.properties.mag ?? 0) - (a.properties.mag ?? 0),
		);
		const msg: EarthquakeWorkerMessage = {
			requestId,
			earthquakes: sorted,
			error: null,
			limited: sorted.length >= RESULT_LIMIT,
		};
		workerSelf.postMessage(msg);
	} catch (error) {
		const msg: EarthquakeWorkerMessage = {
			requestId,
			earthquakes: null,
			error: error instanceof Error ? error.message : 'Error in worker',
			limited: false,
		};
		workerSelf.postMessage(msg);
	}
};
