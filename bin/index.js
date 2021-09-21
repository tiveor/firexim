#!/usr/bin/env node
console.log('Welcome to firexim!!!');

const { ParamHelper } = require('@tiveor/scg');
const { Firexim } = require('../src/firexim.js');

const params = ParamHelper.getParams();
const action = ParamHelper.getCommandByIndex(2);

const validateParams = (params) => {
  for (param of params) {
    if (!param) {
      console.log('> Missing mandatory params');
      return false;
    }
  }
  return true;
};

const names = () => {
  if (!validateParams([params.config])) return;

  const firexim = new Firexim([params.config]);
  firexim.getImportCollectionNames().then((collectionNames) => {
    collectionNames.forEach((name) => {
      console.log(name);
    });
  });
};

const exp = () => {
  if (!validateParams([params.fromConfig, params.fromCollection, params.toFile])) return;

  const firexim = new Firexim([params.fromConfig]);

  firexim.exportCollectionToFile(params.fromCollection, params.toFile).then((filename) => {
    console.log(`${filename} exported succesfully`);
  });
};

const imp = () => {
  if (!validateParams([params.toConfig, params.toCollection, params.fromFile])) return;

  const firexim = new Firexim([params.toConfig]);
  firexim.importCollectionFromFile(params.toCollection, params.fromFile).then((filename) => {
    console.log(`${filename} imported succesfully`);
  });
};

const expimp = () => {
  if (!validateParams([params.fromConfig, params.toConfig, params.fromCollection, params.toCollection])) return;

  const firexim = new Firexim([params.fromConfig, params.toConfig]);
  firexim.importCollection(params.fromCollection, params.toCollection).then(() => {
    console.log('Exported and Imported successfully');
  });
};

try {
  switch (action) {
    case 'names':
      names();
      break;
    case 'exp':
      exp();
      break;
    case 'imp':
      imp();
      break;
    case 'expimp':
      expimp();
      break;
    default:
      console.log('> Action not found');
  }
} catch (e) {
  console.log('> Sorry, an error happened during execution');
  console.log(e.message);
}
