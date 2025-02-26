// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		import { Album } from "$lib/types";

		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		interface PageState {
            release: Album;
        }
		// interface Platform {}
	}
}

export {};
