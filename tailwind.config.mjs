/** @type {import('tailwindcss').Config} */

import plugin from 'tailwindcss/plugin';

const screens = {};

const colors = {
	black: '#000000',
	white: '#FFFFFF',
};

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./src/pages/**/*.{js,ts,jsx,tsx,mdx,astro}',
		'./src/components/**/*.{js,ts,jsx,tsx,mdx,astro}',
		'./src/layouts/**/*.{js,ts,jsx,tsx,astro}',
		'./src/templates/**/*.{js,ts,jsx,tsx,astro}',
		'./src/blocks/**/*.{js,ts,jsx,tsx,astro}',
		'./src/icons/**/*.{js,ts,jsx,tsx,astro}',
		'./src/utils/**/*.{js,ts,jsx,tsx,astro}',
	],
	theme: {
		screens,
		colors,
	},
	plugins: [
		plugin(({ addUtilities }) => {
			addUtilities({});
		}),
	],
};
