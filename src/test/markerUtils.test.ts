import { describe, expect, test } from 'vitest';
import { getMarkerColor, getMarkerSize } from '../utils/markerUtils';

describe('getMarkerColor', () => {
	test('magnitude 5 returns green (range 5-5.9)', () => {
		expect(getMarkerColor(5)).toBe('#8FC891');
	});

	test('magnitude 8 returns dark orange (range 8-8.9)', () => {
		expect(getMarkerColor(8)).toBe('#E9872D');
	});

	test('null magnitude returns gray fallback', () => {
		expect(getMarkerColor(null)).toBe('#a0aec0');
	});
});

describe('getMarkerSize', () => {
	test('scales linearly with magnitude', () => {
		expect(getMarkerSize(6)).toBe(36);
	});

	test('returns minimum 15 for small magnitudes', () => {
		expect(getMarkerSize(1)).toBe(15);
	});

	test('returns minimum 15 for null magnitude', () => {
		expect(getMarkerSize(null)).toBe(15);
	});
});
