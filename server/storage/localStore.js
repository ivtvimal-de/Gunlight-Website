import fs from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import bcrypt from "bcryptjs";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export const LOCAL_DB_FILE = path.resolve(__dirname, "..", "data", "gunlite-local-db.json");

const EMPTY_DB = {
  admins: [],
  categories: [],
  brands: [],
  products: [],
  activities: [],
};

let writeQueue = Promise.resolve();

function generateObjectId() {
  return crypto.randomBytes(12).toString("hex");
}

function clone(val) {
  return val === undefined ? undefined : JSON.parse(JSON.stringify(val));
}

async function readDb() {
  try {
    const raw = await fs.readFile(LOCAL_DB_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return {
      admins: Array.isArray(parsed.admins) ? parsed.admins : [],
      categories: Array.isArray(parsed.categories) ? parsed.categories : [],
      brands: Array.isArray(parsed.brands) ? parsed.brands : [],
      products: Array.isArray(parsed.products) ? parsed.products : [],
      activities: Array.isArray(parsed.activities) ? parsed.activities : [],
    };
  } catch (err) {
    if (err.code === "ENOENT") {
      await writeDb(clone(EMPTY_DB));
      return clone(EMPTY_DB);
    }
    throw err;
  }
}

export async function hasLocalBrandsKey() {
  try {
    const raw = await fs.readFile(LOCAL_DB_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed.brands);
  } catch {
    return false;
  }
}

async function writeDb(data) {
  const run = async () => {
    await fs.mkdir(path.dirname(LOCAL_DB_FILE), { recursive: true });
    const tmpFile = `${LOCAL_DB_FILE}.tmp`;
    await fs.writeFile(tmpFile, JSON.stringify(data, null, 2), "utf8");
    await fs.rename(tmpFile, LOCAL_DB_FILE);
  };
  writeQueue = writeQueue.then(run, run);
  return writeQueue;
}

export async function initLocalStore() {
  await readDb();
  console.log(`Local JSON database ready: ${LOCAL_DB_FILE}`);
}

function normalizeComparable(val) {
  if (val && typeof val === "object" && val._id) return String(val._id);
  return val;
}

function matchesCondition(fieldVal, cond) {
  if (cond instanceof RegExp) {
    if (Array.isArray(fieldVal)) {
      return fieldVal.some((item) => cond.test(String(normalizeComparable(item))));
    }
    return cond.test(String(fieldVal ?? ""));
  }

  if (cond && typeof cond === "object" && !Array.isArray(cond)) {
    const ops = Object.keys(cond);
    const isOperatorObj = ops.some((k) => k.startsWith("$"));
    if (isOperatorObj) {
      for (const op of ops) {
        const target = cond[op];
        if (op === "$ne") {
          const targetNorm = normalizeComparable(target);
          if (Array.isArray(fieldVal)) {
            if (fieldVal.some((v) => String(normalizeComparable(v)) === String(targetNorm))) {
              return false;
            }
          } else if (String(normalizeComparable(fieldVal)) === String(targetNorm)) {
            return false;
          }
        } else if (op === "$in") {
          const arr = Array.isArray(target) ? target.map((t) => String(normalizeComparable(t))) : [];
          if (Array.isArray(fieldVal)) {
            if (!fieldVal.some((v) => arr.includes(String(normalizeComparable(v))))) return false;
          } else if (!arr.includes(String(normalizeComparable(fieldVal)))) {
            return false;
          }
        } else if (op === "$nin") {
          const arr = Array.isArray(target) ? target.map((t) => String(normalizeComparable(t))) : [];
          if (Array.isArray(fieldVal)) {
            if (fieldVal.some((v) => arr.includes(String(normalizeComparable(v))))) return false;
          } else if (arr.includes(String(normalizeComparable(fieldVal)))) {
            return false;
          }
        } else if (op === "$gt") {
          if (!(Number(fieldVal) > Number(target))) return false;
        } else if (op === "$gte") {
          if (!(Number(fieldVal) >= Number(target))) return false;
        } else if (op === "$lt") {
          if (!(Number(fieldVal) < Number(target))) return false;
        } else if (op === "$lte") {
          if (!(Number(fieldVal) <= Number(target))) return false;
        }
      }
      return true;
    }
  }

  const targetStr = String(normalizeComparable(cond));
  if (Array.isArray(fieldVal)) {
    return fieldVal.some((v) => String(normalizeComparable(v)) === targetStr);
  }
  return String(normalizeComparable(fieldVal)) === targetStr;
}

function matchesQuery(doc, query = {}) {
  if (!query || Object.keys(query).length === 0) return true;

  for (const [key, val] of Object.entries(query)) {
    if (key === "$or") {
      if (!Array.isArray(val) || !val.some((sub) => matchesQuery(doc, sub))) {
        return false;
      }
    } else if (key === "$and") {
      if (!Array.isArray(val) || !val.every((sub) => matchesQuery(doc, sub))) {
        return false;
      }
    } else {
      if (!matchesCondition(doc[key], val)) return false;
    }
  }
  return true;
}

function applySelect(doc, selectStr) {
  if (!selectStr || !doc) return doc;
  const tokens = String(selectStr).trim().split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return doc;

  const isExclusion = tokens.every((t) => t.startsWith("-"));
  const isInclusion = tokens.every((t) => !t.startsWith("-") && !t.startsWith("+"));

  if (isExclusion) {
    const out = clone(doc);
    tokens.forEach((t) => delete out[t.slice(1)]);
    return out;
  }

  if (isInclusion) {
    const out = { _id: doc._id };
    tokens.forEach((t) => {
      const clean = t.replace(/^\+/, "");
      if (doc[clean] !== undefined) out[clean] = clone(doc[clean]);
    });
    return out;
  }

  // Handle "+passwordHash" style inclusion
  return clone(doc);
}

function sortRecords(list, sortObj) {
  if (!sortObj || Object.keys(sortObj).length === 0) return list;
  const entries = Object.entries(sortObj);
  return [...list].sort((a, b) => {
    for (const [field, dir] of entries) {
      const av = a[field];
      const bv = b[field];
      if (av === bv) continue;
      if (av === undefined || av === null) return 1;
      if (bv === undefined || bv === null) return -1;
      if (av < bv) return dir < 0 ? 1 : -1;
      if (av > bv) return dir < 0 ? -1 : 1;
    }
    return 0;
  });
}

async function resolvePopulates(records, populates) {
  if (!populates || populates.length === 0) return records;
  const db = await readDb();
  const catById = new Map(db.categories.map((c) => [String(c._id), c]));

  const populateOne = (doc) => {
    if (!doc) return doc;
    const out = clone(doc);
    for (const { field, fieldsSelect } of populates) {
      const val = out[field];
      if (!val) continue;
      if (Array.isArray(val)) {
        out[field] = val
          .map((id) => catById.get(String(normalizeComparable(id))))
          .filter(Boolean)
          .map((c) => (fieldsSelect ? applySelect(c, fieldsSelect) : clone(c)));
      } else {
        const found = catById.get(String(normalizeComparable(val)));
        out[field] = found
          ? fieldsSelect
            ? applySelect(found, fieldsSelect)
            : clone(found)
          : null;
      }
    }
    return out;
  };

  return Array.isArray(records) ? records.map(populateOne) : populateOne(records);
}

class LocalQuery {
  constructor(collectionKey, hooks, executor, isSingle = false) {
    this._collectionKey = collectionKey;
    this._hooks = hooks;
    this._executor = executor;
    this._isSingle = isSingle;
    this._populates = [];
    this._select = null;
    this._sort = null;
    this._skip = 0;
    this._limit = null;
    this._lean = false;
  }

  populate(field, fieldsSelect = null) {
    this._populates.push({ field, fieldsSelect });
    return this;
  }

  select(selectStr) {
    this._select = selectStr;
    return this;
  }

  sort(sortObj) {
    this._sort = sortObj;
    return this;
  }

  skip(n) {
    this._skip = Math.max(0, Number(n) || 0);
    return this;
  }

  limit(n) {
    this._limit = Number(n) || null;
    return this;
  }

  lean() {
    this._lean = true;
    return this;
  }

  async exec() {
    let result = await this._executor();
    if (this._isSingle) {
      if (!result) return null;
      if (this._populates.length > 0) {
        result = await resolvePopulates(result, this._populates);
      }
      if (this._select) {
        result = applySelect(result, this._select);
      }
      return this._lean
        ? result
        : wrapMutableDoc(this._collectionKey, result, this._hooks);
    }

    if (this._sort) result = sortRecords(result, this._sort);
    if (this._skip) result = result.slice(this._skip);
    if (this._limit !== null) result = result.slice(0, this._limit);
    if (this._populates.length > 0) {
      result = await resolvePopulates(result, this._populates);
    }
    if (this._select) {
      result = result.map((r) => applySelect(r, this._select));
    }
    return this._lean
      ? result
      : result.map((r) => wrapMutableDoc(this._collectionKey, r, this._hooks));
  }

  then(resolve, reject) {
    return this.exec().then(resolve, reject);
  }
}

function makeDuplicateError(field) {
  const err = new Error(`Duplicate value for "${field}".`);
  err.code = 11000;
  err.keyPattern = { [field]: 1 };
  return err;
}

function wrapMutableDoc(collectionKey, rawDoc, hooks = {}) {
  if (!rawDoc) return null;
  const doc = clone(rawDoc);

  if (collectionKey === "admins") {
    doc.comparePassword = function comparePassword(plain) {
      return bcrypt.compare(plain, doc.passwordHash);
    };
  }

  doc.save = async function save() {
    const db = await readDb();
    const list = db[collectionKey];
    const idx = list.findIndex((item) => String(item._id) === String(doc._id));

    const prepared = clone(doc);
    delete prepared.save;
    delete prepared.deleteOne;
    delete prepared.comparePassword;

    if (hooks.prepare) {
      hooks.prepare(prepared);
    }
    if (hooks.checkUnique) {
      hooks.checkUnique(prepared, list, doc._id);
    }

    prepared.updatedAt = new Date().toISOString();
    if (idx >= 0) {
      list[idx] = prepared;
    } else {
      list.push(prepared);
    }
    await writeDb(db);
    Object.assign(doc, prepared);
    return doc;
  };

  doc.deleteOne = async function deleteOne() {
    const db = await readDb();
    db[collectionKey] = db[collectionKey].filter(
      (item) => String(item._id) !== String(doc._id)
    );
    await writeDb(db);
    return { deletedCount: 1 };
  };

  return doc;
}

function createCollectionModel(collectionKey, hooks = {}) {
  return {
    find(query = {}) {
      return new LocalQuery(
        collectionKey,
        hooks,
        async () => {
          const db = await readDb();
          return db[collectionKey]
            .filter((d) => matchesQuery(d, query))
            .map((d) => clone(d));
        },
        false
      );
    },

    findOne(query = {}) {
      return new LocalQuery(
        collectionKey,
        hooks,
        async () => {
          const db = await readDb();
          const found = db[collectionKey].find((d) => matchesQuery(d, query));
          return clone(found);
        },
        true
      );
    },

    findById(id) {
      return new LocalQuery(
        collectionKey,
        hooks,
        async () => {
          if (!id) return null;
          const db = await readDb();
          const found = db[collectionKey].find(
            (d) => String(d._id) === String(id)
          );
          return clone(found);
        },
        true
      );
    },

    async countDocuments(query = {}) {
      const db = await readDb();
      return db[collectionKey].filter((d) => matchesQuery(d, query)).length;
    },

    async exists(query = {}) {
      const db = await readDb();
      const found = db[collectionKey].find((d) => matchesQuery(d, query));
      return found ? { _id: found._id } : null;
    },

    async create(payload) {
      const db = await readDb();
      const list = db[collectionKey];
      const now = new Date().toISOString();
      const doc = {
        _id: generateObjectId(),
        ...clone(payload),
        createdAt: now,
        updatedAt: now,
      };

      if (hooks.prepare) hooks.prepare(doc);
      if (hooks.checkUnique) hooks.checkUnique(doc, list, null);

      list.push(doc);
      await writeDb(db);
      return wrapMutableDoc(collectionKey, doc, hooks);
    },

    async updateMany(filter = {}, update = {}) {
      const db = await readDb();
      let modifiedCount = 0;

      db[collectionKey] = db[collectionKey].map((item) => {
        if (!matchesQuery(item, filter)) return item;
        const next = clone(item);

        if (update.$set) {
          Object.entries(update.$set).forEach(([k, v]) => {
            next[k] = clone(v);
          });
        }
        if (update.$addToSet) {
          Object.entries(update.$addToSet).forEach(([k, v]) => {
            const arr = Array.isArray(next[k]) ? [...next[k]] : [];
            const vStr = String(normalizeComparable(v));
            if (!arr.some((x) => String(normalizeComparable(x)) === vStr)) {
              arr.push(clone(v));
            }
            next[k] = arr;
          });
        }
        if (update.$pull) {
          Object.entries(update.$pull).forEach(([k, v]) => {
            if (!Array.isArray(next[k])) return;
            const vStr = String(normalizeComparable(v));
            next[k] = next[k].filter((x) => String(normalizeComparable(x)) !== vStr);
          });
        }

        next.updatedAt = new Date().toISOString();
        modifiedCount += 1;
        return next;
      });

      if (modifiedCount > 0) {
        await writeDb(db);
      }
      return { modifiedCount };
    },
  };
}

export const LocalAdmin = createCollectionModel("admins", {
  prepare(doc) {
    if (doc.email) doc.email = String(doc.email).toLowerCase().trim();
    if (!doc.role) doc.role = "admin";
    if (!doc.name) doc.name = "GunLite Administrator";
  },
  checkUnique(doc, list, selfId) {
    const clash = list.find(
      (i) => String(i._id) !== String(selfId) && i.email === doc.email
    );
    if (clash) throw makeDuplicateError("email");
  },
});

export const LocalCategory = createCollectionModel("categories", {
  prepare(doc) {
    if (doc.name) doc.name = String(doc.name).trim();
    if (doc.slug) doc.slug = String(doc.slug).toLowerCase().trim();
    if (doc.isActive === undefined) doc.isActive = true;
    if (doc.displayOrder === undefined) doc.displayOrder = 0;
  },
  checkUnique(doc, list, selfId) {
    if (
      list.some(
        (i) =>
          String(i._id) !== String(selfId) &&
          i.name.toLowerCase() === String(doc.name).toLowerCase()
      )
    ) {
      throw makeDuplicateError("name");
    }
    if (
      list.some(
        (i) => String(i._id) !== String(selfId) && i.slug === doc.slug
      )
    ) {
      throw makeDuplicateError("slug");
    }
  },
});

export const LocalBrand = createCollectionModel("brands", {
  prepare(doc) {
    if (doc.name) doc.name = String(doc.name).trim();
    if (doc.slug) doc.slug = String(doc.slug).toLowerCase().trim();
    if (doc.isActive === undefined) doc.isActive = true;
    if (doc.isFlagship === undefined) doc.isFlagship = false;
    if (doc.isComingSoon === undefined) doc.isComingSoon = false;
    if (doc.displayOrder === undefined) doc.displayOrder = 0;
  },
  checkUnique(doc, list, selfId) {
    if (
      list.some(
        (i) =>
          String(i._id) !== String(selfId) &&
          i.name.toLowerCase() === String(doc.name).toLowerCase()
      )
    ) {
      throw makeDuplicateError("name");
    }
    if (
      list.some(
        (i) => String(i._id) !== String(selfId) && i.slug === doc.slug
      )
    ) {
      throw makeDuplicateError("slug");
    }
  },
});

export const LocalProduct = createCollectionModel("products", {
  prepare(doc) {
    if (doc.name) doc.name = String(doc.name).trim();
    if (doc.slug) doc.slug = String(doc.slug).toLowerCase().trim();
    if (doc.sku) doc.sku = String(doc.sku).toUpperCase().trim();
    if (doc.category) doc.category = String(normalizeComparable(doc.category));
    if (Array.isArray(doc.categories)) {
      doc.categories = doc.categories.map((c) => String(normalizeComparable(c)));
    }
    if (doc.discountPrice !== null && doc.discountPrice !== undefined && doc.discountPrice !== "") {
      const d = Number(doc.discountPrice);
      const p = Number(doc.price);
      if (Number.isNaN(d) || d < 0 || d > p) {
        const err = new Error("Discount price must be between 0 and regular price");
        err.name = "ValidationError";
        throw err;
      }
      doc.discountPrice = d;
    } else {
      doc.discountPrice = null;
    }
  },
  checkUnique(doc, list, selfId) {
    if (
      list.some((i) => String(i._id) !== String(selfId) && i.slug === doc.slug)
    ) {
      throw makeDuplicateError("slug");
    }
    if (
      list.some((i) => String(i._id) !== String(selfId) && i.sku === doc.sku)
    ) {
      throw makeDuplicateError("sku");
    }
  },
});

export const LocalAdminActivity = createCollectionModel("activities");
