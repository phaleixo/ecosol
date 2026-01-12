import { Pool } from 'pg'

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

export const adapter = {
  queryRaw: async (params: { query: string; values?: any[] }) => {
    const result = await pool.query(params.query, params.values)
    return result.rows
  },
  executeRaw: async (params: { query: string; values?: any[] }) => {
    const result = await pool.query(params.query, params.values)
    return result.rowCount || 0
  },
  startTransaction: async () => {
    const client = await pool.connect()
    await client.query('BEGIN')
    
    return {
      queryRaw: async (params: { query: string; values?: any[] }) => {
        const result = await client.query(params.query, params.values)
        return result.rows
      },
      executeRaw: async (params: { query: string; values?: any[] }) => {
        const result = await client.query(params.query, params.values)
        return result.rowCount || 0
      },
      commit: async () => {
        await client.query('COMMIT')
        client.release()
      },
      rollback: async () => {
        await client.query('ROLLBACK')
        client.release()
      },
    }
  },
  url: process.env.DATABASE_URL!,
}