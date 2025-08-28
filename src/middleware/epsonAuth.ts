// src/middleware/auth.middleware.ts

import { Request, Response, NextFunction } from 'express';

export const ensureAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  // Check if the deviceToken is available in the request (it can be stored in session or request body)
  if (!req.body.deviceToken) {
    return res.redirect('/epson/auth'); // Redirect to the authentication page
  }

  // If token exists, pass control to the next middleware/route
  next();
};
