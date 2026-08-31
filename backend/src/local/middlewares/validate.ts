// middlewares/validate.ts
import { ZodObject } from "zod";
import { Request, Response, NextFunction } from "express";

export const validate =
    (schema: ZodObject) =>
        (req: Request, res: Response, next: NextFunction) => {
            try {
                const validatedData = schema.parse({
                    body: req.body,
                    query: req.query,
                    params: req.params,
                });

                console.log("validatedData", validatedData);

                next();
            } catch (err: any) {
                console.log("err", err);

                return res.status(400).json({
                    success: false,
                    message: "Validation failed",
                    errors: JSON.parse(err)?.map((e: any) => ({
                        path: e.path.join("."), // e.g. "body.email"
                        message: e.message,     // e.g. "Invalid email"
                    })),
                });
            }
        };
