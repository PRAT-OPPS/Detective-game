// src/utils/sqlDatabase.js

const SQL_STORAGE_KEY = "cbi_relational_sql_db";

class RelationalSQLDatabase {
  constructor() {
    this.tables = {
      agents: [],
      sessions: [],
      sql_audit_log: []
    };
    this.initDatabase();
  }

  // Schema Initialization
  initDatabase() {
    try {
      const saved = localStorage.getItem(SQL_STORAGE_KEY);
      if (saved) {
        this.tables = JSON.parse(saved);
      } else {
        // Execute DDL (Data Definition Language)
        this.executeDDL(`
          CREATE TABLE agents (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            badge TEXT NOT NULL,
            password TEXT NOT NULL,
            role TEXT NOT NULL,
            avatar_id TEXT NOT NULL,
            created_at TEXT NOT NULL
          );
        `);

        // Seed Default Demo Agents
        this.query(
          "INSERT INTO agents (id, name, email, badge, password, role, avatar_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
          [
            "agent-jane",
            "Patrick Jane",
            "jane@cbi.gov",
            "CBI-SPEC-001",
            "tea",
            "CBI Senior Consultant",
            "jane",
            new Date().toISOString()
          ]
        );

        this.query(
          "INSERT INTO agents (id, name, email, badge, password, role, avatar_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
          [
            "agent-lisbon",
            "Teresa Lisbon",
            "lisbon@cbi.gov",
            "CBI-LEAD-204",
            "rules",
            "Senior Special Agent",
            "lisbon",
            new Date().toISOString()
          ]
        );
      }
    } catch (err) {
      console.error("SQL Database init failed:", err);
    }
  }

  save() {
    try {
      localStorage.setItem(SQL_STORAGE_KEY, JSON.stringify(this.tables));
    } catch (err) {
      console.error("Failed to persist SQL state:", err);
    }
  }

  logQuery(sql, params = []) {
    this.tables.sql_audit_log.unshift({
      id: Date.now() + Math.random(),
      query: sql,
      params: JSON.stringify(params),
      executed_at: new Date().toLocaleTimeString()
    });
    if (this.tables.sql_audit_log.length > 50) {
      this.tables.sql_audit_log.pop();
    }
    this.save();
  }

  executeDDL(ddlString) {
    this.logQuery(ddlString.trim());
  }

  // Parameterized SQL Query Runner
  query(sql, params = []) {
    this.logQuery(sql, params);
    const trimmed = sql.trim();
    const upper = trimmed.toUpperCase();

    // 1. SELECT Query
    if (upper.startsWith("SELECT")) {
      let rows = [...(this.tables.agents || [])];

      // Handle simple WHERE clauses
      if (upper.includes("WHERE EMAIL = ?")) {
        const val = String(params[0]).toLowerCase();
        rows = rows.filter((r) => r.email.toLowerCase() === val);
      } else if (upper.includes("WHERE (EMAIL = ? OR BADGE = ?) AND PASSWORD = ?")) {
        const credential = String(params[0]).toLowerCase();
        const pwd = String(params[2]);
        rows = rows.filter(
          (r) =>
            (r.email.toLowerCase() === credential || r.badge.toLowerCase() === credential) &&
            r.password === pwd
        );
      } else if (upper.includes("WHERE ID = ?")) {
        rows = rows.filter((r) => r.id === params[0]);
      }

      return rows;
    }

    // 2. INSERT INTO Query
    if (upper.startsWith("INSERT INTO AGENTS")) {
      const [id, name, email, badge, password, role, avatar_id, created_at] = params;

      // Unique Email Constraint Enforcement
      const exists = this.tables.agents.some(
        (a) => a.email.toLowerCase() === String(email).toLowerCase()
      );
      if (exists) {
        throw new Error(`SQLITE_CONSTRAINT: UNIQUE constraint failed: agents.email ('${email}')`);
      }

      const newRow = {
        id,
        name,
        email: String(email).toLowerCase(),
        badge,
        password,
        role,
        avatar_id,
        created_at
      };

      this.tables.agents.push(newRow);
      this.save();
      return { insertId: id, rowsAffected: 1 };
    }

    // 3. DELETE Query
    if (upper.startsWith("DELETE FROM SESSIONS")) {
      this.tables.sessions = [];
      this.save();
      return { rowsAffected: 1 };
    }

    return [];
  }

  // Custom Raw SQL Playground for the Terminal Inspector
  executeRaw(rawSql) {
    const trimmed = rawSql.trim();
    const upper = trimmed.toUpperCase();

    if (upper.startsWith("SELECT * FROM AGENTS")) {
      this.logQuery(rawSql);
      return this.tables.agents;
    }
    if (upper.startsWith("SELECT * FROM SQL_AUDIT_LOG")) {
      return this.tables.sql_audit_log;
    }
    if (upper.startsWith("SELECT COUNT(*) FROM AGENTS")) {
      return [{ count: this.tables.agents.length }];
    }

    return [{ message: "Query executed successfully. Result returned 0 rows." }];
  }

  getAuditLogs() {
    return this.tables.sql_audit_log;
  }
}

export const sqlDb = new RelationalSQLDatabase();