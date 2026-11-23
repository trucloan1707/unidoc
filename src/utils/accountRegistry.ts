export interface RegisteredAccount {
  username: string;
  universityId: string;
  universityName: string;
  studentId: string;
  email: string;
  password?: string;
  verifiedAt: string;
}

const STORAGE_KEY = 'unidoc_registered_accounts';

export function getRegisteredAccounts(): RegisteredAccount[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function findAccountByEmail(email: string): RegisteredAccount | undefined {
  const normalized = email.trim().toLowerCase();
  if (!normalized) return undefined;
  return getRegisteredAccounts().find(
    (acc) => (acc.email || '').trim().toLowerCase() === normalized
  );
}

export function isEmailRegisteredLocally(email: string): boolean {
  return Boolean(findAccountByEmail(email));
}

export function isUsernameTakenLocally(username: string, excludeEmail?: string): boolean {
  const normalizedUser = username.trim().toLowerCase();
  if (!normalizedUser) return false;
  const normalizedExclude = excludeEmail ? excludeEmail.trim().toLowerCase() : '';

  return getRegisteredAccounts().some((acc) => {
    const accUser = (acc.username || '').trim().toLowerCase();
    const accEmail = (acc.email || '').trim().toLowerCase();
    if (normalizedExclude && accEmail === normalizedExclude) {
      return false;
    }
    return accUser === normalizedUser;
  });
}

export function saveNewRegisteredAccount(account: RegisteredAccount): {
  saved: boolean;
  error?: string;
} {
  const normalizedEmail = account.email.trim().toLowerCase();
  const cleanedUsername = account.username.trim();
  const list = getRegisteredAccounts();

  if (list.some((acc) => (acc.email || '').trim().toLowerCase() === normalizedEmail)) {
    return {
      saved: false,
      error:
        'Email này đã được đăng ký tài khoản. Mỗi email chỉ được tạo 1 tài khoản — vui lòng đăng nhập hoặc dùng Quên mật khẩu.',
    };
  }

  if (
    list.some(
      (acc) => (acc.username || '').trim().toLowerCase() === cleanedUsername.toLowerCase()
    )
  ) {
    return {
      saved: false,
      error: 'Tên Username này đã có người sử dụng. Vui lòng chọn Username khác.',
    };
  }

  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify([{ ...account, email: normalizedEmail, username: cleanedUsername }, ...list])
    );
    return { saved: true };
  } catch {
    return { saved: false, error: 'Không thể lưu thông tin tài khoản lúc này.' };
  }
}

export function updateAccountPasswordLocally(email: string, newPassword: string): void {
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail) return;

  const list = getRegisteredAccounts();
  const exists = list.some((acc) => (acc.email || '').trim().toLowerCase() === normalizedEmail);

  const nextList = exists
    ? list.map((acc) =>
        (acc.email || '').trim().toLowerCase() === normalizedEmail
          ? { ...acc, password: newPassword }
          : acc
      )
    : [
        {
          username: normalizedEmail.split('@')[0],
          universityId: '',
          universityName: 'ĐH Kinh tế TP.HCM',
          studentId: '',
          email: normalizedEmail,
          password: newPassword,
          verifiedAt: new Date().toISOString(),
        },
        ...list,
      ];

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextList));
  } catch {}
}

export function updateAccountUsernameLocally(email: string, newUsername: string): void {
  const normalizedEmail = email.trim().toLowerCase();
  const cleanedUsername = newUsername.trim();
  if (!normalizedEmail || !cleanedUsername) return;

  const list = getRegisteredAccounts();
  const exists = list.some((acc) => (acc.email || '').trim().toLowerCase() === normalizedEmail);
  if (!exists) return;

  const nextList = list.map((acc) =>
    (acc.email || '').trim().toLowerCase() === normalizedEmail
      ? { ...acc, username: cleanedUsername }
      : acc
  );

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextList));
  } catch {}
}
