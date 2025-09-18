const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

class Database {
    constructor() {
        if (Database.instance) {
            return Database.instance;
        }
        
        const dataDir = path.join(__dirname, '..', 'data');
        fs.mkdirSync(dataDir, { recursive: true });
        
        this.db = new sqlite3.Database(path.join(dataDir, 'dashboard.db'));
        this.ready = this.init();
        Database.instance = this;
    }

    async init() {
        try {
            await this._rawRun(`
                CREATE TABLE IF NOT EXISTS connectors (
                    id TEXT PRIMARY KEY,
                    name TEXT NOT NULL,
                    endpoint TEXT NOT NULL,
                    username TEXT,
                    auth TEXT
                )
            `);
            await this._rawRun(`
                CREATE TABLE IF NOT EXISTS datasets (
                    id TEXT PRIMARY KEY,
                    connectorId TEXT NOT NULL,
                    name TEXT NOT NULL,
                    filename TEXT NOT NULL,
                    size INTEGER,
                    mimetype TEXT,
                    description TEXT,
                    createdAt TEXT NOT NULL,
                    updatedAt TEXT NOT NULL
                )
            `);
        } catch (error) {
            console.error('Database initialization failed:', error);
            throw error;
        }
    }

    _rawRun(sql, params = []) {
        return new Promise((resolve, reject) => {
            this.db.run(sql, params, function(err) {
                if (err) reject(err);
                else resolve({ id: this.lastID, changes: this.changes });
            });
        });
    }

    async query(sql, params = []) {
        await this.ready;
        return new Promise((resolve, reject) => {
            this.db.all(sql, params, (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    async run(sql, params = []) {
        await this.ready;
        return this._rawRun(sql, params);
    }

    async get(sql, params = []) {
        await this.ready;
        return new Promise((resolve, reject) => {
            this.db.get(sql, params, (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    }

    async select(table, columns = '*', where = null, params = []) {
        const cols = Array.isArray(columns) ? columns.join(', ') : columns;
        let sql = `SELECT ${cols} FROM ${table}`;
        
        if (where) {
            if (typeof where === 'object') {
                const conditions = Object.keys(where).map(key => `${key} = ?`);
                sql += ` WHERE ${conditions.join(' AND ')}`;
                params = Object.values(where);
            } else {
                sql += ` WHERE ${where}`;
            }
        }
        
        return this.query(sql, params);
    }

    async selectOne(table, columns = '*', where = null, params = []) {
        const cols = Array.isArray(columns) ? columns.join(', ') : columns;
        let sql = `SELECT ${cols} FROM ${table}`;
        
        if (where) {
            if (typeof where === 'object') {
                const conditions = Object.keys(where).map(key => `${key} = ?`);
                sql += ` WHERE ${conditions.join(' AND ')}`;
                params = Object.values(where);
            } else {
                sql += ` WHERE ${where}`;
            }
        }
        
        const row = await this.get(sql, params);
        
        // Return direct value if columns is single-item array
        if (Array.isArray(columns) && columns.length === 1 && row) {
            return row[columns[0]];
        }
        
        return row;
    }

    async insert(table, data) {
        const columns = Object.keys(data).join(', ');
        const placeholders = Object.keys(data).map(() => '?').join(', ');
        const values = Object.values(data);
        
        const sql = `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`;
        return this.run(sql, values);
    }

    async put(table, data, conflictColumns = ['id']) {
        const columns = Object.keys(data).join(', ');
        const placeholders = Object.keys(data).map(() => '?').join(', ');
        const updateSet = Object.keys(data).map(col => `${col} = excluded.${col}`).join(', ');
        const values = Object.values(data);
        
        const sql = `INSERT INTO ${table} (${columns}) VALUES (${placeholders}) 
                     ON CONFLICT(${conflictColumns.join(', ')}) DO UPDATE SET ${updateSet}`;
        return this.run(sql, values);
    }

    close() {
        return new Promise((resolve, reject) => {
            this.db.close((err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    }
}

module.exports = new Database();