<script>
	import { setContext } from 'svelte';
	import { ATL_LOCALE_CONTEXT_KEY, mergeMessages } from './i18n/messages.js';

	export let locale = 'en';
	export let dir = 'ltr';
	export let messages = {};

	const contextValue = {
		get locale() {
			return locale;
		},
		get dir() {
			return dir;
		},
		get messages() {
			return mergeMessages(messages);
		},
	};

	setContext(ATL_LOCALE_CONTEXT_KEY, contextValue);
</script>

<div class="atl-locale-provider" {dir} lang={locale}>
	<slot />
</div>

<style>
	.atl-locale-provider {
		display: contents;
	}
</style>
