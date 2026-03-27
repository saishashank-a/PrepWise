"use client";

import { useRef, useCallback, useState } from "react";

interface SQLResult {
  rows: Record<string, unknown>[];
  fields: string[];
  error: string | null;
}

export function usePGlite() {
  const dbRef = useRef<any>(null);
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);

  const init = useCallback(async (setupSql?: string) => {
    setLoading(true);
    try {
      const { PGlite } = await import("@electric-sql/pglite");
      dbRef.current = new PGlite();
      if (setupSql) {
        await dbRef.current.query(setupSql);
      }
      setReady(true);
    } catch (e: any) {
      throw new Error(`Failed to load SQL runtime: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  const run = useCallback(
    async (sql: string): Promise<SQLResult> => {
      if (!dbRef.current) await init();
      try {
        const result = await dbRef.current.query(sql);
        return {
          rows: result.rows || [],
          fields: (result.fields || []).map((f: any) => f.name),
          error: null,
        };
      } catch (e: any) {
        return { rows: [], fields: [], error: e.message };
      }
    },
    [init],
  );

  const loadDataset = useCallback(
    async (datasetName: string) => {
      if (!dbRef.current) await init();
      const response = await fetch(`/datasets/${datasetName}.sql`);
      if (!response.ok) throw new Error(`Dataset ${datasetName} not found`);
      const sql = await response.text();
      await dbRef.current.query(sql);
    },
    [init],
  );

  const resetDb = useCallback(async (setupSql?: string) => {
    dbRef.current = null;
    setReady(false);
    await init(setupSql);
  }, [init]);

  return { run, ready, loading, init, loadDataset, resetDb };
}
