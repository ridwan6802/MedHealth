#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function parseArgs(argv) {
  const args = { source: null, out: null, noCoerce: false };

  for (let index = 2; index < argv.length; index += 1) {
    const token = argv[index];

    if (token === '--source' || token === '-s') {
      args.source = argv[index + 1];
      index += 1;
      continue;
    }

    if (token === '--out' || token === '-o') {
      args.out = argv[index + 1];
      index += 1;
      continue;
    }

    if (token === '--no-coerce') {
      args.noCoerce = true;
    }
  }

  return args;
}

function ensureDirectory(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function isNumericString(value) {
  return typeof value === 'string' && value.trim() !== '' && /^-?\d+(?:\.\d+)?$/.test(value);
}

function coerceValue(fieldName, value) {
  if (value === null || value === undefined) {
    return value;
  }

  if (Array.isArray(value)) {
    return value.map((item) => coerceValue(fieldName, item));
  }

  if (typeof value !== 'string') {
    return value;
  }

  const lowerField = String(fieldName).toLowerCase();

  if (lowerField === 'password' || lowerField === 'email' || lowerField === 'phone' || lowerField === 'transaction_id') {
    return value;
  }

  if (lowerField === 'timestamp' || lowerField.endsWith('_date')) {
    return value;
  }

  if (lowerField === 'is_read' || lowerField === 'is_from_customer' || lowerField.startsWith('is_') || lowerField.startsWith('has_')) {
    if (value === '1' || value === 'true') {
      return true;
    }

    if (value === '0' || value === 'false') {
      return false;
    }
  }

  if (lowerField === 'low_stock_flag') {
    if (value === '1' || value === 'true') {
      return true;
    }

    if (value === '0' || value === 'false') {
      return false;
    }
  }

  if (lowerField === 'price' || lowerField === 'stock' || lowerField === 'quantity' || lowerField === 'id' || lowerField.endsWith('_id')) {
    if (isNumericString(value)) {
      return value.includes('.') ? Number.parseFloat(value) : Number.parseInt(value, 10);
    }
  }

  if (isNumericString(value)) {
    return value.includes('.') ? Number.parseFloat(value) : Number.parseInt(value, 10);
  }

  return value;
}

function normalizeDocument(document) {
  if (document === null || document === undefined) {
    return document;
  }

  if (Array.isArray(document)) {
    return document.map((item) => normalizeDocument(item));
  }

  if (typeof document !== 'object') {
    return document;
  }

  const normalized = {};

  for (const [key, value] of Object.entries(document)) {
    normalized[key] = coerceValue(key, value);
  }

  return normalized;
}

function main() {
  const args = parseArgs(process.argv);

  if (!args.source || !args.out) {
    console.error('Usage: node scripts/import-medicare-json.js --source <phpMyAdmin-export.json> --out <output-folder> [--no-coerce]');
    process.exit(1);
  }

  const sourcePath = path.resolve(args.source);
  const outputDir = path.resolve(args.out);

  if (!fs.existsSync(sourcePath)) {
    console.error(`Source file not found: ${sourcePath}`);
    process.exit(1);
  }

  const raw = fs.readFileSync(sourcePath, 'utf8');
  const parsed = JSON.parse(raw);

  if (!Array.isArray(parsed)) {
    console.error('Expected the export file to contain a top-level JSON array.');
    process.exit(1);
  }

  ensureDirectory(outputDir);

  const collections = [];

  for (const entry of parsed) {
    if (!entry || entry.type !== 'table' || !entry.name || !Array.isArray(entry.data)) {
      continue;
    }

    const documents = args.noCoerce ? entry.data : entry.data.map((row) => normalizeDocument(row));
    const filePath = path.join(outputDir, `${entry.name}.json`);

    fs.writeFileSync(filePath, `${JSON.stringify(documents, null, 2)}\n`, 'utf8');
    collections.push({ name: entry.name, documents: documents.length, filePath });
  }

  const manifestPath = path.join(outputDir, 'manifest.json');
  fs.writeFileSync(manifestPath, `${JSON.stringify({ source: sourcePath, collections }, null, 2)}\n`, 'utf8');

  console.log(`Wrote ${collections.length} collections to ${outputDir}`);
  for (const collection of collections) {
    console.log(`- ${collection.name}: ${collection.documents} documents -> ${collection.filePath}`);
  }
  console.log(`Manifest: ${manifestPath}`);
}

main();