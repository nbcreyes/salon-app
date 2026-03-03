import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'https://salon-app-production-f532.up.railway.app/api';

const getHeaders = async () => {
  const token = await AsyncStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

const get = async (path) => {
  const headers = await getHeaders();
  const res = await fetch(`${BASE_URL}${path}`, { headers });
  return res.json();
};

const post = async (path, body) => {
  const headers = await getHeaders();
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
  return res.json();
};

const put = async (path, body) => {
  const headers = await getHeaders();
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(body),
  });
  return res.json();
};

export default { get, post, put };