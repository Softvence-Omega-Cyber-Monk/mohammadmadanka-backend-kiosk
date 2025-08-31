// src/middleware/auth.middleware.ts

import { Request, Response, NextFunction } from 'express';

export const ensureAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  console.log("Checking authentication...middleware");
  // Check if the deviceToken is available in the request (it can be stored in session or request body)
  if (!req.body.deviceToken) {
    return res.redirect('/epson/auth'); // Redirect to the authentication page
  }

  // If token exists, pass control to the next middleware/route
  next();
};
