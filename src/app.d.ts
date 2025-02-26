// See https://svelte.dev/docs/kit/types#app.d.ts

import type { Album, AlbumQuery } from '$lib/types';

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		interface PageState {
            release?: Album;
            coverPreview?: boolean;
            query?: AlbumQuery;
        }
		// interface Platform {}
	}
}

export {};
