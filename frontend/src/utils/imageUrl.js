export const getImageUrl = (path) => {
    if (!path) return '';

    if (
        /^https?:\/\//i.test(path) ||
        path.startsWith('blob:') ||
        path.startsWith('data:')
    ) {
        return path;
    }

    const backend = import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000';

    return `${backend}/storage/${path}`;
};