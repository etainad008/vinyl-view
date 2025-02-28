import { toasts }  from "svelte-toasts";

export const showToast = (description: string, duration: number) => {
    toasts.add({
    description: description,
    duration: duration,
    theme: 'light',
    showProgress: true,
    placement: 'bottom-right',
    type: 'success'
})};