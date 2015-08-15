import Sqlite, {Database} from 'sqlite3';
import Connection from './connection';

// Enable verbose debugging
Sqlite.verbose();

const _streamWait = 4;

class SqliteConnection extends Connection {
  _connect(config) {

    return new Promise((resolve, reject) => {

      let storagePath = config.storage;
      // If the config is a string grab the path part
      if (typeof config === 'string') {
        storagePath = (/:\/\/(.*)$/.exec(config) || [])[1]
      }
      resolve(new Database(storagePath));
    });
  }
  executeQuery({ text, values }) {

    return new Promise((resolve, reject) => this.db.all(text, values, (error, rows) => {

      if (error) { return reject(error); }
      resolve(rows);
    }));
  }
  // TODO: is this the best implementation?
  streamQuery({ text, values }, stream) {

    let finished = false;
    // The row buffer
    let rows = [];
    let currentRowIndex = 0;

    this.db.each(text, values, (error, row) => {

      if (error) { return strem.emit('error', error); }
      rows.push(row);
    }, error => {

      finished = true;
      if (error) { return strem.emit('error', error); }
    });

    stream._read = function () {

      if (finished && rows.length - 1 === currentRowIndex) { return this.push(null); }

      let retrieveInterval = setInterval(() => {

        // If the row is not yet in the buffer, wait
        if (rows.length - 1 < currentRowIndex) { return; }

        this.push(rows[currentRowIndex]);
        currentRowIndex += 1;
        clearInterval(retrieveInterval);
      }, _streamWait);
    };
  }
}

export default SqliteConnection;
