async function createThing(data) {
  const entity = Object.assign(
    {},
    data,
    {
      id: self.crypto.randomUUID(),
      type: 'thing'
    }
  );

  return addItem(entity);
}

async function createContainer(data) {
  const entity = Object.assign(
    {},
    data,
    {
      id: self.crypto.randomUUID(),
      type: 'container'
    }
  );

  return addItem(entity);
}

function addItem(entity) {
  return new Promise((resolve, reject)=> {
    const request = indexedDB.open("things-db", 1);
    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction(["data"], "readwrite");

      const objectStore = transaction.objectStore("data");
      objectStore.add(entity);

      transaction.oncomplete = () => {
        resolve(entity)
      };

      transaction.onerror = () => {
        reject({});
      };
    }
  });
}

function deleteItem(id) {
  return new Promise((resolve) => {
    const connection = indexedDB.open("things-db", 1);
    connection.onsuccess = (event) => {
      const db = event.target.result;

      const request = db
        .transaction(["data"], "readwrite")
        .objectStore("data")
        .delete(id);
      request.onsuccess = () => {
        resolve({id});
      };
    }
  })
}

function getItem(id) {
  return new Promise((resolve) => {
    const connection = indexedDB.open("things-db", 1);
    connection.onsuccess = (event) => {
      const db = event.target.result;

      db
        .transaction("data")
        .objectStore("data")
        .get(id).onsuccess = ({target: {result = {}}}) => {
          resolve(result);
        };
    }
  })
}

function getAllThings() {
  return getItems().then(data => data.filter(item => item.type === 'thing'));
}

function getAllContainers() {
  return getItems().then(data => data.filter(item => item.type === 'container'));
}

function getItems() {
  return new Promise((resolve) => {
    const connection = indexedDB.open("things-db", 1);
    connection.onsuccess = (event) => {
      const db = event.target.result;

      db
        .transaction("data")
        .objectStore("data")
        .getAll().onsuccess = ({target: {result = {}}}) => {
          resolve(result);
        };
    }
  })
}

function updateItem(id, {name, description, value, parent, content}) {
  return new Promise((resolve, reject) => {
    const connection = indexedDB.open("things-db", 1);
    connection.onsuccess = (event) => {
      const db = event.target.result;

      const objectStore = db
        .transaction(["data"], "readwrite")
        .objectStore("data");
      const request = objectStore.get(id);
      request.onerror = () => {
        reject({})
      };
      request.onsuccess = (event) => {
        const data = event.target.result;

        if (name) data.name = name;
        if (description) data.description = description;
        if (value) data.value = value;
        if (parent) data.parent = parent;
        if (content) data.content = content;

        const requestUpdate = objectStore.put(data);
        requestUpdate.onerror = () => {
          reject({});
        };
        requestUpdate.onsuccess = () => {
          resolve(data);
        };
      };
    }
  })
}
