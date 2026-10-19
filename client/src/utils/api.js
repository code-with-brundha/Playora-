export const API_BASE_URL =
  typeof window !== 'undefined' && window.location.hostname === 'localhost'
    ? 'http://localhost:5000'
    : '';

export const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem('playora_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers
  };

  const url = `${API_BASE_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || data.message || `Request failed (${response.status})`);
  }

  return data;
};

export const api = {
  auth: {
    login: (credentials) =>
      apiFetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
      }),
    register: (userData) =>
      apiFetch('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
      }),
    forgotPassword: (email) =>
      apiFetch('/api/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email })
      }),
    resetPassword: (token, newPassword) =>
      apiFetch('/api/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ token, newPassword })
      }),
    getMe: () => apiFetch('/api/auth/me'),
    updateProfile: (profileData) =>
      apiFetch('/api/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(profileData)
      }),
    updateSettings: (settingsData) =>
      apiFetch('/api/auth/settings', {
        method: 'PUT',
        body: JSON.stringify(settingsData)
      }),
    changePassword: (currentPassword, newPassword) =>
      apiFetch('/api/auth/change-password', {
        method: 'PUT',
        body: JSON.stringify({ currentPassword, newPassword })
      }),
    deleteAccount: () =>
      apiFetch('/api/auth/account', {
        method: 'DELETE'
      }),
    recordMahjongStats: (stats) =>
      apiFetch('/api/auth/stats/mahjong', {
        method: 'POST',
        body: JSON.stringify(stats)
      }),
    recordRpsStats: (stats) =>
      apiFetch('/api/auth/stats/rps', {
        method: 'POST',
        body: JSON.stringify(stats)
      }),
    unlockAchievement: (data) =>
      apiFetch('/api/auth/achievements/unlock', {
        method: 'POST',
        body: JSON.stringify(data)
      }),
    getLeaderboard: (type = 'all') => apiFetch(`/api/auth/leaderboard?type=${type}`)
  },
  rooms: {
    getAll: () => apiFetch('/api/rooms'),
    getByCode: (roomCode) => apiFetch(`/api/rooms/${roomCode}`),
    create: (roomData) =>
      apiFetch('/api/rooms', {
        method: 'POST',
        body: JSON.stringify(roomData)
      }),
    quickMatch: (gameType = 'tictactoe') =>
      apiFetch('/api/rooms/quick-match', {
        method: 'POST',
        body: JSON.stringify({ gameType })
      })
  }
};
