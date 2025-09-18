const { formatValue, retrieveType } = require("./tools");

const searchByKeyword = async (keyword, baseUrl, headers, brokerLocation, limit, offset) => {
    const searchUrl = `${baseUrl}/search?recipient=${encodeURIComponent(brokerLocation)}&limit=${limit}&offset=${offset}`;
    const response = await fetch(searchUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(keyword)
    });
    
    if (!response.ok) {
        return res.status(response.status).json({ error: `HTTP ${response.status}` });
    }
    
    const accessUrls = new Set();
    const lines = (await response.text()).split('\n').slice(1);
    
    for (const line of lines) {
        if (line.length > 0) {
            const parts = line.split('\t');
            if (parts[2] === '<https://w3id.org/idsa/core/Resource>' && parts[4]) {
                accessUrls.add(parts[4].slice(1, -1));
            }
        }
    }

    return Array.from(accessUrls);
}

const sendQuery = async (query, baseUrl, headers, brokerLocation, returnType = 'object') => {
    try {
        const queryUrl = `${baseUrl}/query?recipient=${encodeURIComponent(brokerLocation)}`;
        const response = await fetch(queryUrl, {
            method: 'POST',
            headers,
            body: query
        });
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const groupedResults = {};
        const lines = (await response.text()).split('\n').slice(1);
        for (const line of lines) {
            if (line.length > 0) {
                const parts = line.split('\t');
                if (parts.length >= 3) {
                    const id = formatValue(parts[0]);
                    const res = formatValue(parts[1]);
                    const type = retrieveType(parts[2]);

                    groupedResults[id] ??= {}
                    
                    if (groupedResults[id][type]) {
                        if (!Array.isArray(groupedResults[id][type])) {
                            groupedResults[id][type] = [groupedResults[id][type]];
                        }
                        groupedResults[id][type].push(res);
                    } else {
                        groupedResults[id][type] = res;
                    }
                }
            }
        }
        if (returnType === 'array') {
            Object.keys(groupedResults).forEach(key => {
                groupedResults[key].accessUrl = key;
                groupedResults[key].brokerLocation = brokerLocation;
            });
        }
        return returnType === 'object' ? groupedResults : Object.values(groupedResults);
    } catch (error) {
        throw error;
    }
}

const searchByBaseIdsExact = async (ids, baseUrl, headers, brokerLocation) => {
    if (typeof ids === 'string') {
        ids = [ids];
    }
    const valuesClause = ids.map(v => `<${v}>`).join(' ');
    const sparqlQuery = `SELECT ?resultUri ?res ?type
WHERE {
  ?resultUri ?type ?res
  VALUES ?resultUri {
    ${valuesClause}
  }
}`;
    return await sendQuery(sparqlQuery, baseUrl, headers, brokerLocation, 'array');
}

const searchByBaseId = async (id, baseUrl, headers, brokerLocation) => {
    const sparqlQuery = `SELECT ?resultUri ?res ?type
WHERE {
  ?resultUri ?type ?res
  FILTER (
    STRSTARTS(STR(?resultUri), "${id}")
  )
}`;
    return await sendQuery(sparqlQuery, baseUrl, headers, brokerLocation);
}

module.exports = {
    searchByKeyword, searchByBaseIdsExact, searchByBaseId
}