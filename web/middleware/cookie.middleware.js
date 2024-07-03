
export const CookieSet = (req, res, next) => {
    const csrfToken = req.csrfToken();
    res.cookie("CRF-TOKEN", csrfToken, { httpOnly: true, path: '/' });
    next();
}