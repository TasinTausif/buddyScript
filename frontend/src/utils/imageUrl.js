export const getImageUrl = (path) => {
    if (!path) return '';

    if (/^https?:\/\//i.test(path) || path.startsWith('blob:') || path.startsWith('data:')) {
        return path;
    }

    const apiUrl = (import.meta.env.VITE_API_URL || '/api').replace(/\/$/, '');
    const cleanPath = path.replace(/^\//, '').replace(/^storage\//, '');

    return `${apiUrl}/product-images/${cleanPath}`;
};
