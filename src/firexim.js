const admin = require('firebase-admin');
const fs = require('fs');

class Firexim {

  constructor(configJsonFiles) {
    this.firestores = [];
    for (let i = 0; i < configJsonFiles.length; i++) {
      let config = configJsonFiles[i];
      let firestore = this.initializeFirestore(config, `firestore${i}`);
      this.firestores.push(firestore);
    }

    this.importIndex = 0;
    this.exportIndex = 1;//Default index for export
  }

  initializeFirestore(configJsonFile, nameRef) {
    const serviceAccount = JSON.parse(fs.readFileSync(configJsonFile));
    const ref = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    }, nameRef);
    return ref.firestore();
  }

  setFirestoreImportIndex(index) {
    if (index > 0 && index < this.firestores.length) {
      this.importIndex = index;
    }
  }

  setFirestoreExportIndex(index) {
    if (index > 0 && index < this.firestores.length) {
      this.exportIndex = index;
    }
  }

  getFirestoreExport() {
    return this.firestores[this.exportIndex];
  }

  getFirestoreImport() {
    return this.firestores[this.importIndex];
  }

  getFirestoreAt(index) {
    return this.firestores[index];
  }

  getImportCollectionNames() {
    return this.getCollectionNames(this.importIndex);
  }

  getExportCollectionNames() {
    return this.getCollectionNames(this.exportIndex);
  }

  getCollectionNames(index) {
    return new Promise((resolve, reject) => {
      try {
        let collectionNames = [];
        this.getFirestoreAt(index).listCollections().then((collections) => {
          for (let collection of collections) {
            collectionNames.push(collection.id);
          }
          resolve(collectionNames);
        })
      } catch (e) {
        reject(e);
      }
    });
  }

  exportCollectionToFile(collection, filename) {
    return this.exportCollectionToFileByIndex(0, collection, filename);
  }

  exportCollectionToFileByIndex(index, collection, filename) {
    return new Promise((resolve, reject) => {
      try {
        this.getFirestoreAt(index).collection(collection).get().then((snapshot) => {
          var docs = [];
          snapshot.forEach((doc) => {
            const data = doc.data();
            docs.push({ ...data, id: doc.id });
          });

          const json = JSON.stringify(docs);

          fs.writeFile(`${filename}`, json, 'utf8', (x) => {
            resolve(filename);
          });
        });
      } catch (e) {
        reject(e);
      }
    });
  }

  importCollectionFromFile(collection, filename) {
    return this.importCollectionFromFileByIndex(0, collection, filename);
  }

  importCollectionFromFileByIndex(index, collection, filename) {
    return new Promise((resolve, reject) => {
      try {
        var docs = JSON.parse(fs.readFileSync(filename, 'utf8'));
        const batch = this.getFirestoreAt(index).batch();
        docs.forEach((doc) => {
          let myRef = this.getFirestoreAt(index).collection(collection);
          if (doc.id) {
            myRef = myRef.doc(doc.id);
          } else {
            myRef = myRef.doc();
          }
          batch.set(myRef, doc);
        });
        batch.commit();
        resolve(filename);
      } catch (e) {
        console.log(e);
        reject(e);
      }
    })
  }

  importCollection(collectionFrom, collectionTo) {
    return new Promise((resolve, reject) => {
      this.getFirestoreImport().collection(collectionFrom).get().then((snapshot) => {
        const batch = this.getFirestoreExport().batch();
        try {
          snapshot.forEach((doc) => {
            const data = doc.data();

            const myRef = this.getFirestoreExport().collection(collectionTo).doc(doc.id);
            batch.set(myRef, data);
          });
          batch.commit();
          resolve(true);
        } catch (e) {
          console.log(e);
          reject(e);
        }
      });
    });
  }
}

module.exports = {
  Firexim
};
