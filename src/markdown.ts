import titleCase from 'better-title-case';
import { DateTime } from 'luxon';
import * as matter from 'gray-matter';
import { Micropub } from './schemas';
import { generateSuggestedSummary } from './ai';
import slugify from '@sindresorhus/slugify';

export async function generateMarkdown(properties: Micropub['properties']) {
	const data = await generateFrontmatterData(properties);
	return matter.stringify(properties.content[0], data);
}

async function generateFrontmatterData(properties: Micropub['properties']) {
	const title = titleCase(properties.name[0]);
	const date = DateTime.now()
		.setZone('America/New_York')
		.toFormat("yyyy-MM-dd'T'T");
	return {
		title,
		date,
		summary: await generateSuggestedSummary(properties.content[0]),
		tags: [],
		published: false,
	};
}

export function generateFilename(properites: Micropub['properties']) {
	const now = DateTime.now().setZone('America/New_York');
	const date = now.toFormat('yyyy-MM-dd');
	const year = now.toFormat('yyyy');
	const month = now.toFormat('MM');
	const slug = slugify(properites.name[0], {
		customReplacements: [["'", '']],
	});
	return `${Bun.env.CONTENT_PATH}/${year}/${month}/${date}-${slug}.md`;
}
