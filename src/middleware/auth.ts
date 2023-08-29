import { Request } from "express";
import jwt from 'jsonwebtoken'

export interface AuthenticatedRequest extends Request {
  user: any
  token: string
}

export function auth(req: AuthenticatedRequest, res, next) {
  if (req.originalUrl == '/ping') {
    next()
  }
  if (!req.headers.authorization) {
    return res.status(403).json({ error: 'No credentials sent!' });
  }
  if (!process.env.SECREST_KEY) {
    return res.status(500).json({ error: 'Service is not config correctly' });
  }

  let token = req.headers.authorization.substring(7, req.headers.authorization.length)
  let user;
  try {
    user = jwt.verify(token, process.env.SECREST_KEY)
  } catch (error) {
    return res.status(403).json({
      error: 'Authentication failed!'
    });
  }
  req.user = user
  req.token = token
  next()
}