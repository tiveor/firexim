firexim<br/>
[![Build Status](https://travis-ci.org/tiveor/firexim.svg?branch=main)](https://travis-ci.org/tiveor/firexim)
[![npm version](https://badge.fury.io/js/%40tiveor%2Ffirexim.svg)](https://badge.fury.io/js/%40tiveor%2Ffirexim)
=============================

A Firestore Export/Import Library and CLI

## Library Installation

```
npm install @tiveor/firexim
```

### Library usage

```javascript
const { firexim } = require('@tiveor/firexim')

const firexim = new Firexim([
  'serviceAccountExport.json',
  'serviceAccountImport.json'
])
```

### Library Export Collection

```javascript
firexim
  .exportCollectionToFile('collectionName', './path/to/file.json')
  .then(() => {
    console.log('collectionName exported to file.json')
  })
  .catch(e => {
    console.log(e)
  })
```

### Library Import Collection

```javascript
firexim
  .importCollectionFromFile('collectionName', './path/to/file.json')
  .then(() => {
    console.log('collectionName exported to file.json')
  })
  .catch(e => {
    console.log(e)
  })
```

### Library Export/Import Collection

```javascript
firexim
  .importCollection('fromCollectionName', 'toCollectionName')
  .then(() => {
    console.log('Exported and Imported successfully')
  })
  .catch(e => {
    console.log(e)
  })
```

## CLI Instalation

```
npm install -g @tiveor/firexim
```

### CLI usage - Collection Names

```bash
firexim names --config="config/serviceAccount.json"
```

### CLI usage - Collection export To File

```bash
firexim exp --fromConfig="config/serviceAccount.json" --fromCollection="collectionName" --toFile="output/collectionName.json"
```

### CLI usage - Collection import from File

```bash
firexim imp --toConfig="config/serviceAccount.json" --toCollection="collectionName" --fromFile="input/collectionName.json"
```

### CLI usage - Export/Import from/to Collection

```bash
firexim expimp --fromConfig="config/serviceAccountExport.json"  --fromCollection="collectionName" --toConfig="config/serviceAccountImport.json" --toCollection="collectionName"
```
