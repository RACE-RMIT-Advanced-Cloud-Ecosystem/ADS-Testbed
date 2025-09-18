const formatValue = (value) => {
    if (!value) return value;
    const urlMatch = value.match(/^<((http|https):\/\/.*)>$/);
    if (urlMatch) {
        const url = urlMatch[1];
        const idsaMatch = url.match(/^https:\/\/w3id\.org\/idsa\/(code|core)\/(.*)$/)
        return idsaMatch?.[2] ?? url;
    }
    const match = value.match(/^"(.*?)"(?:@\w+|\^\^<.*>)?$/);
    if (match) {
        return match[1];
    }
    return value;
};

const retrieveType = (value) => {
    if (!value) return value;
    const typeMatch = value.match(/^<http.{0,1}.*(\/|#)(\w+)>$/);
    if (typeMatch) {
        const type = typeMatch[2];
        return type;
    }
    return value;
}

module.exports = {
    formatValue, retrieveType
}
