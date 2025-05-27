import type { NextApiRequest, NextApiResponse } from "next"
import { authenticate, authorize } from "./auth"

type NextApiHandler = (req: NextApiRequest, res: NextApiResponse) => Promise<void>

// Helper to chain middleware
export const withMiddleware = (
  handler: NextApiHandler,
  middlewares: ((req: any, res: NextApiResponse, next: () => void) => void)[],
) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    // Create a middleware chain
    const runMiddleware = async (index: number) => {
      if (index < middlewares.length) {
        await new Promise<void>((resolve) => {
          middlewares[index](req, res, () => resolve())
        })
        await runMiddleware(index + 1)
      } else {
        await handler(req, res)
      }
    }

    await runMiddleware(0)
  }
}

// Authentication middleware
export const withAuth = (handler: NextApiHandler) => {
  return withMiddleware(handler, [authenticate])
}

// Role-based authorization middleware
export const withRole = (handler: NextApiHandler, roles: string[]) => {
  return withMiddleware(handler, [authenticate, authorize(roles)])
}

// Error handling middleware
export const withErrorHandling = (handler: NextApiHandler) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      await handler(req, res)
    } catch (error: any) {
      console.error("API error:", error)

      // Prisma error handling
      if (error.code && error.code.startsWith("P")) {
        return res.status(400).json({
          message: "Database error",
          error: error.message,
        })
      }

      // Default error response
      const statusCode = error.statusCode || 500
      const message = error.message || "Internal server error"

      res.status(statusCode).json({ message })
    }
  }
}
