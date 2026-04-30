const fs = require('fs/promises');
const path = require('path');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const serverRoot = path.resolve(__dirname, '..');
const seedDir = path.resolve(serverRoot, '..', 'medhealth-seed');
const manifestPath = path.join(seedDir, 'manifest.json');

const toAbsolutePath = (filePath) => {
  if (path.isAbsolute(filePath)) {
    return filePath;
  }

  return path.resolve(serverRoot, '..', filePath);
};

const main = async () => {
  const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/medhealth';

  await mongoose.connect(mongoUri);

  try {
    for (const collection of manifest.collections) {
      const collectionName = collection.name;
      const filePath = toAbsolutePath(collection.filePath);

      const documents = collection.documents > 0
        ? JSON.parse(await fs.readFile(filePath, 'utf8'))
        : [];

      if (collectionName === 'users') {
        for (const document of documents) {
          if (typeof document.password === 'string' && !document.password.startsWith('$2')) {
            document.password = await bcrypt.hash(document.password, 10);
          }
          if (document.email) {
            document.email = String(document.email).toLowerCase();
          }
        }
      }

      const db = mongoose.connection.db;
      const dbCollection = db.collection(collectionName);

      await dbCollection.drop().catch(() => {});

      if (collection.documents === 0) {
        await db.createCollection(collectionName).catch(() => {});
        continue;
      }

      if (documents.length > 0) {
        await dbCollection.insertMany(documents);
      }

      console.log(`Imported ${documents.length} documents into ${collectionName}`);
    }

    console.log('MedHealth seed import complete.');
  } finally {
    await mongoose.disconnect();
  }
};

main().catch((error) => {
  console.error('Seed import failed:', error);
  process.exit(1);
});