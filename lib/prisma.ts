import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

// Import do pacote Prisma no runtime de forma defensiva para evitar
// erros de tipagem quando os tipos gerados não estão presentes no workspace.
let PrismaPkg: any = null
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  PrismaPkg = require('@prisma/client')
} catch (e) {
  PrismaPkg = null
}

// Definição do objeto global para persistência em desenvolvimento
interface CustomNodeJSGlobal {
  prisma: any | undefined
  pgPool: Pool | undefined
}

const globalForPrisma = globalThis as unknown as CustomNodeJSGlobal

const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error('DATABASE_URL não configurada no .env.local')
}

// Inicialização Única do Pool (Visão de Engenharia)
if (!globalForPrisma.pgPool) {
  globalForPrisma.pgPool = new Pool({ 
    connectionString,
    max: 10,
    idleTimeoutMillis: 30000 
  })
}

const adapter = new PrismaPg(globalForPrisma.pgPool)

// Detecta possíveis formas de exportação do pacote @prisma/client
const PrismaClientCtor = PrismaPkg
  ? PrismaPkg.PrismaClient ?? PrismaPkg.default?.PrismaClient ?? PrismaPkg.default ?? PrismaPkg
  : undefined

if (!PrismaClientCtor || (typeof PrismaClientCtor !== 'function' && typeof PrismaClientCtor !== 'object')) {
  throw new Error(
    "@prisma/client não está disponível ou não exporta 'PrismaClient'. Instale dependências e rode `npx prisma generate`."
  )
}

export const prisma =
  globalForPrisma.prisma ?? new (PrismaClientCtor as any)({
    adapter,
    log: ['error'], // Foca nos erros críticos de driver
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma