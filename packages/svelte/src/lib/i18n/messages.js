import { getContext } from 'svelte';

export const ATL_LOCALE_CONTEXT_KEY = Symbol.for('design-atlas:locale');

/**
 * Default English messages for Design Atlas Svelte components.
 */
export const defaultMessagesEn = Object.freeze({
	alert: {
		dismiss: 'Close',
		defaultTitle: 'Title',
	},
	textInput: {
		clear: 'Clear input',
	},
	select: {
		placeholder: 'Select an option',
	},
	tabs: {
		navigationLabel: 'Tabs navigation',
	},
	menu: {
		linkLabel: 'Link',
		moreThan99Items: 'More than 99 items',
		itemsCount: (count) => `${count} items`,
	},
	container: {
		close: 'Close',
		toggleSheet: 'Toggle sheet',
	},
});

/**
 * Example Brazilian Portuguese message catalog for AtlLocaleProvider.
 */
export const exampleMessagesPtBr = Object.freeze({
	alert: {
		dismiss: 'Fechar',
		defaultTitle: 'Título',
	},
	textInput: {
		clear: 'Limpar campo',
	},
	select: {
		placeholder: 'Selecione uma opção',
	},
	tabs: {
		navigationLabel: 'Navegação por abas',
	},
	menu: {
		linkLabel: 'Link',
		moreThan99Items: 'Mais de 99 itens',
		itemsCount: (count) => `${count} itens`,
	},
	container: {
		close: 'Fechar',
		toggleSheet: 'Alternar painel',
	},
});

/**
 * Deep-merges partial message overrides with English defaults.
 */
export function mergeMessages(overrides = {}) {
	return {
		alert: { ...defaultMessagesEn.alert, ...(overrides.alert || {}) },
		textInput: { ...defaultMessagesEn.textInput, ...(overrides.textInput || {}) },
		select: { ...defaultMessagesEn.select, ...(overrides.select || {}) },
		tabs: { ...defaultMessagesEn.tabs, ...(overrides.tabs || {}) },
		menu: { ...defaultMessagesEn.menu, ...(overrides.menu || {}) },
		container: { ...defaultMessagesEn.container, ...(overrides.container || {}) },
	};
}

/**
 * Reads the active AtlLocaleProvider context, falling back to English LTR defaults.
 */
export function getAtlLocale() {
	try {
		const ctx = getContext(ATL_LOCALE_CONTEXT_KEY);
		if (ctx) return ctx;
	} catch {
		// Outside component initialization
	}
	return {
		locale: 'en',
		dir: 'ltr',
		messages: defaultMessagesEn,
	};
}
