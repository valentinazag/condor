import * as v from 'valibot';

export const EarthquakeSchema = v.object({
	features: v.array(
		v.object({
			properties: v.object({
				mag: v.nullable(v.number()),
				place: v.nullable(v.string()),
				time: v.number(),
				url: v.nullable(v.string()),
			}),
			geometry: v.object({
				coordinates: v.tuple([v.number(), v.number(), v.number()]),
			}),
		}),
	),
});

export type EarthquakeFeature = v.InferOutput<
	typeof EarthquakeSchema
>['features'][number];

export type EarthquakeWorkerMessage =
	| { requestId: number; earthquakes: EarthquakeFeature[]; error: null }
	| { requestId: number; earthquakes: null; error: string };
