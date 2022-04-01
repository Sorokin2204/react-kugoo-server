const fetchFakeServer = async (path, method, params) => {
  const response = await fetch(
    jsonServer(`${path}${method === 'GET' ? params : ''}`),
    {
      method: method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      ...(method === 'POST' && {
        body: JSON.stringify({ id: ObjectID(), ...params }),
      }),
    },
  );
  const content = await response.json();
  return content;
};

module.exports = { fetchFakeServer };
