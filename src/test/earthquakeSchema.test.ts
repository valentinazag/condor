import * as v from 'valibot';
import { describe, expect, test } from 'vitest';
import { EarthquakeSchema } from '../types/EarthquakeTypes';

const validFeature = {
	properties: {
		mag: 5.2,
		place: '10km NW of Mexico City',
		time: 1704067200000,
		url: 'https://earthquake.usgs.gov/earthquakes/eventpage/us7000sqzv/executive',
	},
	geometry: { coordinates: [-99.1, 19.4, 10.0] },
};

describe('EarthquakeSchema', () => {
	test('parses a valid response with one feature', () => {
		const result = v.parse(EarthquakeSchema, { features: [validFeature] });
		expect(result.features).toHaveLength(1);
		expect(result.features[0].properties.mag).toBe(5.2);
	});

	test('accepts empty features array — no earthquakes found is valid', () => {
		const result = v.parse(EarthquakeSchema, { features: [] });
		expect(result.features).toHaveLength(0);
	});

	test('accepts null magnitude', () => {
		const data = {
			features: [
				{
					...validFeature,
					properties: { ...validFeature.properties, mag: null },
				},
			],
		};
		const result = v.parse(EarthquakeSchema, data);
		expect(result.features[0].properties.mag).toBeNull();
	});

	test('rejects feature without geometry', () => {
		expect(() =>
			v.parse(EarthquakeSchema, {
				features: [{ properties: validFeature.properties }],
			}),
		).toThrow();
	});

	test('rejects string time', () => {
		const data = {
			features: [
				{
					...validFeature,
					properties: { ...validFeature.properties, time: '2024-01-01' },
				},
			],
		};
		expect(() => v.parse(EarthquakeSchema, data)).toThrow();
	});

	test('accepts null place', () => {
		const data = {
			features: [
				{
					...validFeature,
					properties: { ...validFeature.properties, place: null },
				},
			],
		};
		const result = v.parse(EarthquakeSchema, data);
		expect(result.features[0].properties.place).toBeNull();
	});
});
