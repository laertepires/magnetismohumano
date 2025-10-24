export const LIKE_COOKIE_NAME = "mh_like_id";
export const LIKE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365 * 5; // 5 anos

export const likeCookieOptions = {
  maxAge: LIKE_COOKIE_MAX_AGE,
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  path: "/",
};
