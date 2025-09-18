// Context registry for dynamic context management
const contextRegistry = new Map();

export function registerContext(name, config) {
    contextRegistry.set(name, config);
}

export function getInitialState() {
    const state = {};
    for (const [, config] of contextRegistry) {
        Object.assign(state, config.initialState);
    }
    return state;
}

export function createReducer() {
    return function appReducer(state, action) {
        const { payload } = action;
        
        for (const [, config] of contextRegistry) {
            if (config.actions && config.actions[action.type]) {
                return config.actions[action.type](state, payload);
            }
        }
        
        return state;
    };
}

export function createHooks(appContext) {
    const hooks = {};
    for (const [name, config] of contextRegistry) {
        if (config.createHook) {
            hooks[`use${name}`] = config.createHook(appContext);
        }
    }
    return hooks;
}