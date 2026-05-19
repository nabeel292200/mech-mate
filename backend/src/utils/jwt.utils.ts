import jwt from "jsonwebtoken";

/**
 * Sign a JWT token
 * @param {Object} payload - { id, phone, role }
 * @returns {string} signed token
 */
export const signToken = (payload: { id: string | any; phone: string; role: string }): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is missing");
  }
  return jwt.sign(payload, secret, {
    expiresIn: (process.env.JWT_EXPIRES_IN || "7d") as any,
  });
};

/**
 * Verify a JWT token
 * @param {string} token
 * @returns {any} decoded payload
 */
export const verifyToken = (token: string): any => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is missing");
  }
  return jwt.verify(token, secret);
};
