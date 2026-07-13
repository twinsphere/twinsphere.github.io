// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	integrations: [
		starlight({
			title: 'twinsphere',
			// Brand theme derived from the Claude Design handoff. See
			// src/styles/theme.css and docs/adr/0002-theme-within-starlight.md.
			customCss: ['./src/styles/theme.css'],
			// Wordmark header ("twin" green + "sphere") replaces the plain title.
			components: {
				SiteTitle: './src/components/SiteTitle.astro',
			},
			// Sidebar mirrors the former mkdocs.yml nav tree. Release-notes pages
			// live in the `releases` collection and are referenced as `link:` items.
			sidebar: [
				{ label: 'Home', link: '/' },
				{ label: 'Contact us', slug: 'contact' },
				{ label: 'Status', slug: 'status' },
				{
					label: 'twinsphere ID',
					items: [
						{ label: 'Overview', slug: 'id-overview' },
						{
							label: 'Users',
							items: [
								{ label: 'Registration', slug: 'id-registration' },
								{ label: 'Login', slug: 'id-login' },
								{ label: 'Password reset', slug: 'id-password-reset' },
							],
						},
						{ label: 'Service accounts', slug: 'id-service-accounts' },
					],
				},
				{
					label: 'Management',
					items: [
						{ label: 'Overview', slug: 'management-overview' },
						{ label: 'API', slug: 'management-api' },
						{ label: 'Roles', slug: 'management-roles' },
					],
				},
				{
					label: 'Cloud',
					items: [
						{ label: 'API Documentation', slug: 'cloud-documentation' },
						{
							label: 'Proprietary Features',
							items: [
								{ label: 'Overview', slug: 'cloud-proprietary-features' },
								{ label: 'Events', slug: 'cloud-events' },
								{ label: 'Search', slug: 'cloud-search' },
								{ label: 'Push Service', slug: 'cloud-push-service' },
								{ label: 'Semantic Connector', slug: 'cloud-semantic-connector' },
								{ label: 'Shell Filter Queries', slug: 'cloud-shell-filter-queries' },
								{ label: 'File Filter Queries', slug: 'cloud-file-filter-queries' },
								{ label: 'Statistics', slug: 'cloud-statistics' },
								{ label: 'ABAC (Attribute Based Access Control)', slug: 'cloud-abac' },
							],
						},
						{ label: 'Authentication', slug: 'cloud-auth' },
						{ label: 'Client Generation', slug: 'cloud-client-generation' },
						{ label: 'Release Notes', link: '/cloud-release-notes/' },
					],
				},
				{
					label: 'Studio',
					items: [
						{ label: 'Overview', slug: 'studio-overview' },
						{ label: 'General Features', slug: 'studio-general-features' },
						{ label: 'Statistics', slug: 'studio-statistics' },
						{ label: 'Catalog', slug: 'studio-catalog' },
						{ label: 'Twin Builder', slug: 'studio-twin-builder' },
						{ label: 'Release Notes', link: '/studio-release-notes/' },
					],
				},
				{
					label: 'Viewer',
					items: [
						{ label: 'Overview', slug: 'viewer-overview' },
						{ label: 'Features', slug: 'viewer-features' },
						{ label: 'Release Notes', link: '/viewer-release-notes/' },
					],
				},
				{
					label: 'Development libraries (DevKit)',
					items: [
						{ label: 'Overview', slug: 'typed-aas-metamodels-overview' },
						{ label: 'Supported Submodels', slug: 'typed-aas-metamodels-submodels' },
						{ label: 'Validation', slug: 'typed-aas-metamodels-validation' },
						{ label: 'Release Notes DevKit', link: '/typed-aas-metamodels-release_notes/' },
						{ label: 'Release Notes Rulebook', link: '/typed-aas-metamodels-rulebook-release_notes/' },
					],
				},
				{
					label: 'Validators',
					items: [{ label: 'Overview', slug: 'validators-overview' }],
				},
				{
					label: 'Tips & Tricks',
					items: [{ label: 'Common Validation Errors', slug: 'tips-common-validation-errors' }],
				},
			],
		}),
	],
});
