/** @type {import("prettier").Config} */
export default {
	plugins: ['prettier-plugin-astro', 'prettier-plugin-tailwindcss'],
	overrides: [
		{
			files: '*.astro',
			options: {
				parser: 'astro',
			},
		},
	],
	trailingComma: 'es5',
	useTabs: true,
	tabWidth: 4,
	semi: true,
	singleQuote: true,
};
