/** @param {URL} url */
function isApiCall(url) {
  const regex = /\/api\//;
  return !!url.pathname.match(regex);
}

/** @param {URL} url */
function isThingsApiCall(url) {
  const regex = /\/api\/things/;
  return !!url.pathname.match(regex);
}

/** @param {URL} url */
function isContainersApiCall(url) {
  const regex = /\/api\/containers/;
  return !!url.pathname.match(regex);
}

/** @param {URL} url */
function isContainersContentApiCall(url) {
  const regex = /\/api\/containers\/content/;
  return !!url.pathname.match(regex);
}

/** @param {string} url */
function findUUID(url) {
  const uuidRegexp = /[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/gmi;
  const result = url.match(uuidRegexp);
  return Array.isArray(result) ? result[0] : result;
}
