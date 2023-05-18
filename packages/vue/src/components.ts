const classifyRE = /(?:^|[-_])(\w)/g;
const classify = (str: string): string => str.replace(classifyRE, c => c.toUpperCase()).replace(/[-_]/g, '');

const ROOT_COMPONENT_NAME = '<Root>';
const ANONYMOUS_COMPONENT_NAME = '<Anonymous>';

export const formatComponentName = (vm?: Vue, includeFile?: boolean): string => {
    if (!vm) {
        return ANONYMOUS_COMPONENT_NAME;
    }

    if (vm.$root === vm) {
        return ROOT_COMPONENT_NAME;
    }

    if (!vm.$options) {
        return ANONYMOUS_COMPONENT_NAME;
    }

    const options = vm.$options;
    let name = options.name;

    return (
        (name ? `<${classify(name)}>` : ANONYMOUS_COMPONENT_NAME)
    );
};
