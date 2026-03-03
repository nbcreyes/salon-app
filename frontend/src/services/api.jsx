const BASE_URL = 'http://localhost:5000/api';

const get = async (path) => {
  const res = await fetch(`${BASE_URL}${path}`);
  return res.json();
};

export default { get };