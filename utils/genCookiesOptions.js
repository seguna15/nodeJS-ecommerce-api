export const cookieOptions = () => {
  return {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
  };
};
