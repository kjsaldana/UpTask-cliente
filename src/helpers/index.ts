export function formatDate(dateStr: string) {
    const dateObj = new Date(dateStr)
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }
    return Intl.DateTimeFormat('es-ES', options).format(dateObj)
}