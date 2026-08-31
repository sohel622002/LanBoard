import dotenv from 'dotenv';
import { PrismaClient as SupabaseClient } from '../../prisma/generated/supabase-client'
import { PrismaClient as LocalClient } from '../../prisma/generated/local-client'

// Load environment variables from .env file
dotenv.config();

class DatabaseService {
  public cloud: SupabaseClient
  public local: LocalClient

  constructor() {
    this.cloud = new SupabaseClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    })
    this.local = new LocalClient({
      datasources: {
        db: {
          url: process.env.LOCAL_DATABASE_URL,
        },
      },
    })
  }

  async connect() {
    try {
      await this.cloud.$connect()
      console.log('✅ Connected to Supabase (Cloud DB)')
    } catch (error) {
      console.error('❌ Failed to connect to cloud DB:', error)
    }

    try {
      await this.local.$connect()
      console.log('✅ Connected to Local PostgreSQL')
    } catch (error) {
      console.error('❌ Failed to connect to local DB:', error)
    }
  }

  async disconnect() {
    await this.cloud.$disconnect()
    await this.local.$disconnect()
  }

  // Health check for each database
  async healthCheck() {
    const status = { cloud: false, local: false }

    try {
      await this.cloud.$queryRaw`SELECT 1`
      status.cloud = true
    } catch (error) {
      console.error('Cloud DB health check failed:', error)
    }

    try {
      await this.local.$queryRaw`SELECT 1`
      status.local = true
    } catch (error) {
      console.error('Local DB health check failed:', error)
    }

    return status
  }
}

export const db = new DatabaseService()