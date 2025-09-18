function getType(rightOperand) {
    if (!isNaN(rightOperand)) {
        return 'xsd:double'
    }
    if (rightOperand.startsWith('http')) {
        return 'xsd:anyURI'
    }
    if (/^\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d/.test(rightOperand)) {
        return 'xsd:dateTimeStamp'
    }
    if (/^P(?:\d+Y)?(?:\d+M)?(?:\d+D)?(?:T(?:\d+H)?(?:\d+M)?(?:\d+(?:\.\d+)?S)?)?$/.test(rightOperand)) {
        return 'xsd:duration'
    }
    return 'xsd:string'
}

export default function(rule, artifact) {
    const {
        sameAs: id,
        title, description, type, action, constraint
    } = rule;
    
    const ruleJSON = {
        "@id": id,
        "@type": `ids:${type}`,
        "ids:title": [{
            "@value": title,
            "@type": "http://www.w3.org/2001/XMLSchema#string"
        }],
        "ids:description": [{
            "@value": description,
            "@type": "http://www.w3.org/2001/XMLSchema#string"
        }],
        "ids:action": [{
            "@id": `https://w3id.org/idsa/code/${action}`
        }],
        "ids:target": artifact
    }

    if (constraint) {
        const { sameAs: id, type, leftOperand, operator, rightOperand } = constraint;
        ruleJSON['ids:constraint'] = [{
            "@id": id,
            "@type": `ids:${type}`,
            "ids:leftOperand": {
                "@id": `https://w3id.org/idsa/code/${leftOperand}`
            },
            "ids:operator": {
                "@id": `https://w3id.org/idsa/code/${operator}`
            },
            "ids:rightOperand": {
                "@value": rightOperand,
                "@type": getType(rightOperand)
            }
        }]
    }

    return ruleJSON;
}

