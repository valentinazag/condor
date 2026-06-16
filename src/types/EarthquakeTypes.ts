import * as v from 'valibot';

export const EarthquakeSchema = v.object({
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

export type EarthquakeFeature = v.InferOutput<
	typeof EarthquakeSchema
>['features'][number];

export type EarthquakeWorkerMessage =
	| { earthquakes: EarthquakeFeature[]; error: null }
	| { earthquakes: null; error: string };
