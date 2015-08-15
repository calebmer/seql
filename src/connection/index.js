const _connections = {
  sqlite: './sqlite'
};

export function getConnection(dialect, config) {

  if (dialect in _connections) {
    let connectionModule = require(_connections[dialect]);
    let constructor = connectionModule.default || connectionModule;
    let connection = new constructor();

    return new Promise((resolve, reject) =>
      connection.connect(config)
      .catch(reject)
      .then(() => resolve(connection))
    );
  } else {
    throw new Error(`Dialect ${dialect} not supported`);
  }
}
