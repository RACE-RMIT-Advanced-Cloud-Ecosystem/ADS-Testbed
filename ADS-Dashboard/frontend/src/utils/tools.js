export function getErrorMessage(error) {
    try {
        if (error.cause) {
            return JSON.stringify(error.cause);
        }
    } catch { /* empty */ }
    return error.message;
}

export function strToJsonStr(s) {
    try {
        return JSON.stringify(JSON.parse(s), null, 2);
    } catch {
        return s;
    }
}

export function retrieveEndpoint(path) {
    return new URL(path.replace(/\{\?[^}]*\}$/, '')).pathname;
}

export function getEntityId(url) {
    if (!url) return '';
    return url.split('/').pop();
}

export function trimSentence(desc, characters = 100) {
    if (!desc) return '';
    const descLength = desc.length;
    if (descLength > characters) {
        desc = desc.slice(0, characters);
        desc += '...';
    }
    return desc;
}

export function getUtcDate(date) {
    const dateObj = new Date(date);
    return new Date(Date.UTC(
        dateObj.getFullYear(),
        dateObj.getMonth(),
        dateObj.getDate(),
        0, 0, 0
    ));
}

export function getUrlByEndpoint(connectorEndpoint, elementUrl) {
    const connectorOrigin = new URL(connectorEndpoint).origin;
    const elementPath = new URL(elementUrl).pathname;
    return `${connectorOrigin}${elementPath}`;
}