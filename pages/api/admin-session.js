export default function handler(req, res) {
  const cookie = req.headers.cookie || '';
  const isAdmin = cookie.split(';').some((part) => part.trim() === 'consulate_admin=1');
  return res.status(200).json({ isAdmin });
}
