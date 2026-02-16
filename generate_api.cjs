
const fs = require('fs');
const path = require('path');

const openApiSpec = JSON.parse(fs.readFileSync('openapi.json', 'utf8'));
const outputDir = path.join(__dirname, 'src/api/services');

// Helper to capitalize first letter
const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

// Helper to camelCase (gasto-recorrente -> gastoRecorrente)
const toCamelCase = (s) => s.replace(/-([a-z])/g, (g) => g[1].toUpperCase());

// Map OpenAPI types to TypeScript types
const mapType = (schema) => {
    if (!schema) return 'any';
    if (schema.$ref) {
        return capitalize(schema.$ref.split('/').pop());
    }
    if (schema.type === 'array') {
        return `Array<${mapType(schema.items)}>`;
    }
    if (schema.type === 'integer' || schema.type === 'number') {
        return 'number';
    }
    if (schema.type === 'boolean') {
        return 'boolean';
    }
    if (schema.type === 'string') {
        if (schema.format === 'date' || schema.format === 'date-time') {
            return 'string';
        }
        return 'string';
    }
    return 'any';
};

// We will generate services based on Tags or Paths
const services = {};
const typeDefinitions = {};

// 1. Collect all types and generate their code
Object.keys(openApiSpec.components.schemas).forEach(schemaName => {
    const schema = openApiSpec.components.schemas[schemaName];
    const properties = schema.properties || {};

    let tsCode = `export type ${capitalize(schemaName)} = {\n`;
    Object.keys(properties).forEach(propName => {
        const prop = properties[propName];
        tsCode += `    ${propName}?: ${mapType(prop)}\n`;
    });
    tsCode += `}\n`;

    typeDefinitions[schemaName] = tsCode;
});

// 2. Group paths by Controller (Tag)
Object.keys(openApiSpec.paths).forEach(pathKey => {
    const pathItem = openApiSpec.paths[pathKey];
    Object.keys(pathItem).forEach(method => {
        const operation = pathItem[method];
        const tag = operation.tags[0]; // e.g., "usuario-controller"
        let serviceName = tag.replace('-controller', ''); // e.g., "gasto-recorrente"
        serviceName = toCamelCase(serviceName); // e.g., "gastoRecorrente"

        if (!services[serviceName]) {
            services[serviceName] = {
                methods: [],
                types: new Set()
            };
        }

        // Add methods
        services[serviceName].methods.push({
            name: operation.operationId,
            path: pathKey,
            method: method.toUpperCase(),
            params: operation.parameters || [],
            requestBody: operation.requestBody
        });

        // Identify types used
        if (operation.requestBody) {
            const ref = operation.requestBody.content['application/json'].schema.$ref;
            if (ref) services[serviceName].types.add(ref.split('/').pop());
        }
        if (operation.responses['200'] && operation.responses['200'].content) {
            const schema = operation.responses['200'].content['*/*'].schema;
            if (schema.$ref) services[serviceName].types.add(schema.$ref.split('/').pop());
            if (schema.type === 'array' && schema.items.$ref) services[serviceName].types.add(schema.items.$ref.split('/').pop());
        }
    });
});

// Map schemas to owners
const schemaOwners = {};
Object.keys(typeDefinitions).forEach(schemaName => {
    // dumb heuristic: lowercase schema name
    Object.keys(services).forEach(svc => {
        if (schemaName.toLowerCase().startsWith(svc.replace(/-/g, '').toLowerCase())) {
            schemaOwners[schemaName] = svc;
        }
    });

    if (!schemaOwners[schemaName]) {
        if (services[toCamelCase(schemaName.toLowerCase())]) {
            schemaOwners[schemaName] = toCamelCase(schemaName.toLowerCase());
        }
    }
});

// Ensure all schemas have an owner
Object.keys(typeDefinitions).forEach(schemaName => {
    if (!schemaOwners[schemaName]) {
        schemaOwners[schemaName] = 'shared';
        for (const svc in services) {
            if (services[svc].types.has(schemaName)) {
                schemaOwners[schemaName] = svc;
                break;
            }
        }
    }
});

// Write Types to their owners
Object.keys(schemaOwners).forEach(schemaName => {
    const owner = schemaOwners[schemaName];
    const typeContent = typeDefinitions[schemaName];

    let imports = [];
    Object.keys(typeDefinitions).forEach(otherType => {
        if (otherType !== schemaName && typeContent.includes(otherType)) {
            const otherOwner = schemaOwners[otherType];
            if (otherOwner !== owner) {
                imports.push(`import { ${otherType} } from "../../${otherOwner}/@types/${otherType}";`);
            } else {
                imports.push(`import { ${otherType} } from "./${otherType}";`);
            }
        }
    });

    const fileContent = imports.join('\n') + (imports.length ? '\n\n' : '') + typeContent;
    const ownerDir = path.join(outputDir, owner, '@types');
    if (!fs.existsSync(ownerDir)) fs.mkdirSync(ownerDir, { recursive: true });

    fs.writeFileSync(path.join(ownerDir, `${schemaName}.ts`), fileContent);
});

// Write Gateways
Object.keys(services).forEach(serviceName => {
    const methods = services[serviceName].methods;
    let imports = [
        `import { gerarService } from "../gerarService";`,
        `import { ServiceInputProps } from "../ServiceInputProps";`
    ];

    const usedTypes = new Set();
    methods.forEach(m => {
        if (m.requestBody) {
            const ref = m.requestBody.content['application/json'].schema.$ref;
            if (ref) usedTypes.add(ref.split('/').pop());
        }
        if (m.params) {
            // check params if they use types? usually primitives
        }
    });

    usedTypes.forEach(t => {
        const owner = schemaOwners[t];
        if (owner) {
            if (owner !== serviceName) {
                imports.push(`import { ${t} } from "../${owner}/@types/${t}";`);
            } else {
                imports.push(`import { ${t} } from "./@types/${t}";`);
            }
        }
    });

    let gatewayContent = imports.join('\n') + `\n\n`;

    // Naming
    const gatewayName = `${serviceName}Gateway`;

    gatewayContent += `export const ${gatewayName} = {\n`;

    methods.forEach(m => {
        // CLEANUP METHOD NAME
        const cleanName = m.name.replace(/_\d+$/, '');

        let inputType = 'ServiceInputProps<null, null>';
        const bodyRef = m.requestBody ? m.requestBody.content['application/json'].schema.$ref : null;
        const bodyType = bodyRef ? bodyRef.split('/').pop() : 'null';

        const pathParams = m.params.filter(p => p.in === 'path');

        const args = [];
        pathParams.forEach(p => args.push(`${p.name}: ${mapType(p.schema)}`));
        args.push(`input: ServiceInputProps<${bodyType}, null>`);

        const methodSig = `${cleanName}: async (${args.join(', ')})`;

        let endpointStr = m.path.replace(/{/g, '${').replace(/}/g, '}');

        gatewayContent += `  ${methodSig} => (\n`;
        gatewayContent += `    await gerarService({\n`;
        gatewayContent += `      endpoint: \`${endpointStr}\`,\n`;
        gatewayContent += `      method: "${m.method}",\n`;
        gatewayContent += `      options: input\n`;
        gatewayContent += `    })\n`;
        gatewayContent += `  ),\n`;
    });

    gatewayContent += `};\n`;

    const serviceDir = path.join(outputDir, serviceName);
    if (!fs.existsSync(serviceDir)) fs.mkdirSync(serviceDir, { recursive: true });
    fs.writeFileSync(path.join(serviceDir, `${gatewayName}.ts`), gatewayContent);
});

// 4. Create main api.ts
let apiContent = '';
Object.keys(services).forEach(svc => {
    const gatewayName = `${svc}Gateway`;
    apiContent += `import { ${gatewayName} } from "./services/${svc}/${gatewayName}";\n`;
});
apiContent += `\nexport const api = {\n`;
Object.keys(services).forEach(svc => {
    apiContent += `    ${svc}: ${gatewayName => `${svc}Gateway`}(),\n`.replace(/.*: /, '').replace(/\(\),/, `: ${svc}Gateway,`); // hacky string manipulation for previous line
    // simpler:
});
apiContent = ''; // reset
Object.keys(services).forEach(svc => {
    const gatewayName = `${svc}Gateway`;
    apiContent += `import { ${gatewayName} } from "./services/${svc}/${gatewayName}";\n`;
});
apiContent += `\nexport const api = {\n`;
Object.keys(services).forEach(svc => {
    apiContent += `    ${svc}: ${svc}Gateway,\n`;
});
apiContent += `};\n`;

fs.writeFileSync(path.join(__dirname, 'src/api/api.ts'), apiContent);

console.log("Generation complete.");
