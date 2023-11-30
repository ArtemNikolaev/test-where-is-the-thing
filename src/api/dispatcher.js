importScripts(
  'api/dispatcher.utils.js',
  'api/validation.utils.js',
  'api/parseBody.js',
  'api/db.js',
);

/** @param {Request} request */
async function dispatcher(request) {
  const url = new URL(request.url);
  switch (true) {
    case isThingsApiCall(url):
      return dispatchThingsCall(request);
    case isContainersContentApiCall(url):
      return dispatchContainersContentCall(request);
    case isContainersApiCall(url):
      return dispatchContainersCall(request);
  }
}

/** @param {Request} request */
async function dispatchThingsCall(request) {
  const uuid = findUUID(request.url);
  const body = await parseBody(request.body);

  switch (request.method) {
    case 'POST':
      validateEntity(body);
      return createThing(body);
    case 'GET':
      if (uuid) {
        return getItem(uuid);
      }

      return getAllThings();
    case 'PUT':
      return updateItem(uuid, body);
    case 'DELETE':
      return deleteItem(uuid);
  }
}

/** @param {Request} request */
async function dispatchContainersCall(request) {
  const uuid = findUUID(request.url);
  const body = await parseBody(request.body);

  switch (request.method) {
    case 'POST':
      validateEntity(body);
      return createContainer(body);
    case 'GET':
      if (uuid) {
        return getItem(uuid);
      }

      return getAllContainers();
    case 'PUT':
      return updateItem(uuid, body);
    case 'DELETE':
      return deleteItem(uuid);
  }
}

/** @param {Request} request */
async function dispatchContainersContentCall(request) {
  const uuid = findUUID(request.url);
  const body = await parseBody(request.body);

  switch (request.method) {
    case 'POST':
      validateEntity(body);
      return createContainer(body);
    case 'PUT':
      return updateItem(uuid, body);
    case 'DELETE':
      return deleteItem(uuid);
  }
}
