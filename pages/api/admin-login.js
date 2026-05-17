function getAdminUsers() {
  if (process.env.ADMIN_USERS) {
    try {
      const users = JSON.parse(process.env.ADMIN_USERS);
      if (Array.isArray(users)) return users;
    } catch {}
  }

  const username = process.env.ADMIN_USER;
  const password = process.env.ADMIN_PASS;
  if (username && password) return [{ username, password }];
  return [];
}

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const users = getAdminUsers();
  const { username, password } = req.body || {};
  const isValid = users.some((user) => user.username === username && user.password === password);

  if (!isValid) return res.status(401).json({ error: 'Sai tài khoản hoặc mật khẩu' });

  res.setHeader('Set-Cookie', [
    'consulate_admin=1; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800; Secure',
  ]);
  return res.status(200).json({ success: true });
}
