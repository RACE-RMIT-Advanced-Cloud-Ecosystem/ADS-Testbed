export default {
    "N_TIMES_USAGE": [
        { name: 'value', type: 'number' }
    ],
    "USAGE_DURING_INTERVAL": [
        { name: 'start', type: 'date' },
        { name: 'end', type: 'date' }
    ],
    "DURATION_USAGE": [
        { name: 'duration', type: 'text' }
    ],
    "USAGE_UNTIL_DELETION": [
        { name: 'start', type: 'date' },
        { name: 'end', type: 'date' },
        { name: 'date', type: 'date' }
    ],
    "USAGE_NOTIFICATION": [
        { name: 'url', type: 'text' }
    ],
    "CONNECTOR_RESTRICTED_USAGE": [
        { name: 'url', type: 'text' }
    ],
    'SECURITY_PROFILE_RESTRICTED_USAGE': [
        { name: 'profile', type: 'text' }
    ]
}