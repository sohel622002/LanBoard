import { postgresService } from '../services/postgresService';
import { Request, Response } from 'express';

export class PostgresController {
    async downloadPostgresBinaries(req: Request, res: Response): Promise<void> {
        try {
            await postgresService.downloadPostgresBinaries();
            res.json({ success: true });
        } catch (error) {
            console.error('Postgres controller error:', error);
            res.status(500).json({ success: false, message: error instanceof Error ? error.message : 'Internal server error' });
        }
    }

    async initializePostgresBinaries(req: Request, res: Response): Promise<void> {
        try {
            const initializePostgresResponse = await postgresService.initializePostgresBinaries();
            res.json(initializePostgresResponse);
        } catch (error) {
            console.error('Postgres controller error:', error);
            res.status(500).json({ success: false, message: error instanceof Error ? error.message : 'Internal server error' });
        }
    }
}

export const postgresController = new PostgresController();