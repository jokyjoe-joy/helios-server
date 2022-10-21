/*
 * Enables saving the user as req.user upon authentication.
 */
declare namespace Express {
  export interface Request {
     user?: string
  }
}