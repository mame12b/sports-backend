import jwt from 'jsonwebtoken';

const ACCESS_EXPIRES = process.env.ACCESS_EXPIRES || '15m';
const REFRESH_EXPIRES = process.env.REFRESH_EXPIRES || '7d';

export function signAccessToken(user) {
    const payload = {
        sub: user._id.toString(), 
        roles: user.roles };
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: ACCESS_EXPIRES });

}
export function verifyAccessToken(token) {
    return jwt.verify(token, process.env.JWT_SECRET);
}

export function signRefreshToken(user) {
    const payload = {
        sub: user._id.toString() };
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: REFRESH_EXPIRES });
}