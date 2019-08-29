const typeHelper = require('./typeHelper');
const { prepareName } = require('../utils/utils');

function getDefinitions(data) {
	const internalDefinitions = getInternalDefinitions(data.containers);
	const modelDefinitions = getModelDefinitions(data.modelDefinitions);

	return Object.assign({}, internalDefinitions, modelDefinitions);
}

function getModelDefinitions(definitions) {
	if (!definitions) {
		return null;
	}
	const parsedDefinitions = JSON.parse(definitions);

	if (!parsedDefinitions.properties) {
		return null;
	}

	return Object.keys(parsedDefinitions.properties).reduce((acc, key) => {
		const name = prepareName(key);
		
		acc[name] = typeHelper.getType(parsedDefinitions.properties[key]);

		return acc;
	}, {});
}

function getInternalDefinitions(containers) {
	if (!containers) {
		return null;
	}

	return containers.reduce((acc, container) => {
		return Object.assign({}, acc, getContainerInternalDefinitions(container));
	}, {});
}

function getContainerInternalDefinitions(container) {
	return Object.keys(container.internalDefinitions)
		.map(key => getCollectionInternalDefinitions(JSON.parse(container.internalDefinitions[key])))
		.filter(containerDefinition => containerDefinition)
		.reduce((acc, containerDefinition) => Object.assign({}, acc, containerDefinition), {});
}

function getCollectionInternalDefinitions(definitions) {
	if (!definitions || !definitions.properties) {
		return null;
	}
	Object.keys(definitions.properties).reduce((acc, key) => {
		const name = prepareName(key);

		return Object.assign({}, acc, {
			[name]: typeHelper.getType(definitions.properties[key])
		});
	}, {});
}

module.exports = getDefinitions;
