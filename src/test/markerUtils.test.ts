import { describe, expect, test } from 'vitest';
import {
	buildPopupHTML,
	getMarkerColor,
	getMarkerSize,
} from '../utils/markerUtils';

describe('getMarkerColor', () => {
	test('magnitude 5 returns green (range 5-5.9)', () => {
		expect(getMarkerColor(5)).toBe('#8FC891');
	});

	test('magnitude 8 returns dark orange (range 8-8.9)', () => {
		expect(getMarkerColor(8)).toBe('#E9872D');
	});

	test('null magnitude returns gray fallback', () => {
		expect(getMarkerColor(null)).toBe('#090909');
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

describe('buildPopupHTML', () => {
	const PLACE = '10km NW of Mexico City';
	const TIME = 1704067200000;

	test('includes magnitude value', () => {
		expect(buildPopupHTML(5.2, PLACE, TIME)).toContain('5.2');
	});

	test('shows fallback text when magnitude is null', () => {
		expect(buildPopupHTML(null, PLACE, TIME)).toContain(
			'No magnitude available',
		);
	});

	test('includes place when provided', () => {
		expect(buildPopupHTML(5, PLACE, TIME)).toContain(PLACE);
	});

	test('shows fallback text when place is null', () => {
		expect(buildPopupHTML(5, null, TIME)).toContain('No place available');
	});

	test('shows "No date available" when time is 0', () => {
		expect(buildPopupHTML(5, PLACE, 0)).toContain('No date available');
	});

	test('uses black text for light magnitude colors', () => {
		expect(buildPopupHTML(2, PLACE, TIME)).toContain('color: #000000');
	});

	test('uses marker color as text for dark magnitudes', () => {
		expect(buildPopupHTML(7, PLACE, TIME)).toContain('color: #F7C328');
	});
});
