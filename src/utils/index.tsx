export function extractTable(text: string): string[] {
    return [...text.matchAll(/<table(?:.|\n)*?>((?:.|\n)*?)<\/table>/g)]
        .map(item => item[1])
}

export function extractRow(text: string): string[] {
    return [...text.matchAll(/<tr(?:.|\n)*?>((?:.|\n)*?)<\/tr>/g)]
        .map(item => item[1])
}

export function extractCol(text: string): string[] {
    return [...text.matchAll(/<td(?:.|\n)*?>((?:.|\n)*?)<\/td>/g)]
        .map(item => item[1])
}