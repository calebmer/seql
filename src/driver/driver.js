class Driver {
  connect(config) {

    return new Promise((resolve, reject) => {

      if ('_connect' in this) {
        this._connect(config)
        .catch(reject)
        .then(db => {

          this.db = db;
          resolve();
        });
      } else {
        reject(new Error('Failed to connect'));
      }
    });
  }
  executeQuery() {

    return new Promise((resolve, reject) => reject(new Error('Query execution not implemented')));
  }
  streamQuery() {

    throw new Error('Query streaming not implemented');
  }
}

export default Driver;
