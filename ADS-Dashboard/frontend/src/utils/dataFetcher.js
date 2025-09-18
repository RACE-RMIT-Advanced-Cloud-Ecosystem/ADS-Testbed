import { getConnectorSelfDescription } from './api';

export async function fetchAllConnectorData(activeConnector, { basicIdsGet, validateRuleType }) {
    if (!activeConnector) return null;

    const selfDescription = await getConnectorSelfDescription(activeConnector);
    const artifacts = (await basicIdsGet('artifacts', 'artifacts'))._embedded?.artifacts;
    const representations = (await basicIdsGet('representations', 'representations'))._embedded?.representations;
    const resources = (await basicIdsGet('offers', 'resources'))._embedded?.resources;
    const requests = (await basicIdsGet('requests', 'resources'))._embedded?.resources;
    const catalogs = (await basicIdsGet('catalogs', 'catalogs'))._embedded?.catalogs;
    const contracts = (await basicIdsGet('contracts', 'contracts'))._embedded?.contracts;
    const agreements = (await basicIdsGet('agreements', 'agreements'))._embedded?.agreements;
    const rules = (await basicIdsGet('rules', 'rules'))._embedded?.rules;
    const brokers = (await basicIdsGet('brokers', 'brokers'))._embedded?.brokers;
    
    const rulesWithTypes = await Promise.all(rules.map(async rule => {
        let type = null;
        try {
            type = await validateRuleType(JSON.parse(rule.value));
        } catch { /* empty */ }
        return { ...rule, type: type || 'UNKNOWN' };
    }));

    const confirmedAgreements = agreements.filter(e => e.confirmed).length;

    return {
        selfDescription,
        artifacts,
        representations,
        resources,
        requests,
        catalogs,
        contracts,
        agreements,
        rules: rulesWithTypes,
        brokers,
        metrics: {
            "artifact": artifacts.length,
            "representation": representations.length,
            "resource": resources.length,
            "catalog": catalogs.length,
            "contract": contracts.length,
            "agreement": agreements.length,
            "request": requests.length,
            "policy": rules.length,
            "broker": brokers.length,
            "agreement-confirmed": confirmedAgreements,
        }
    };
}