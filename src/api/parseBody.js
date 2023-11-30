async function parseBody(body) {
  try {
  if (!body) return Promise.resolve(null);

  let finalString = '';

  const reader = body.getReader();

  while (true) {
    const {done, value} = await reader.read();

    if (done) { break; }

    finalString += new TextDecoder().decode(value.subarray(0, value.length))
  }

  return JSON.parse(finalString);
  } catch (e) {
    throw e;
  }
}
