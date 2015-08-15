import Assert from 'assert';
import {Readable} from 'stream';
import Debugger from 'debug';
import {Sql} from 'sql';
import {getConnection} from './connection'

const debug = new Debugger('seql');
const debugQuery = new Debugger('seql:query');

class Database extends Sql {
  constructor(connectionConfig) {

    let dialect = connectionConfig.dialect;

    // If using a url e.g. 'mysql://user:pass@host/db' we need to parse out the dialect
    if (typeof connectionConfig === 'string') {
      dialect = (/^(.*?):\/\//.exec(connectionConfig) || [])[1];
    }

    Assert(typeof dialect === 'string', 'Must provide a string dialect');

    super(dialect);

    this.connectionConfig = connectionConfig;

    // Setup the connection promise
    this.connection = new Promise((resolve, reject) => {

      debug(`Connecting to a ${this.dialectName} database`);

      getConnection(this.dialectName, this.connectionConfig)
      .catch(reject)
      .then(resolve);
    });

    this.connection.catch(error => { throw error; });
  }
  setDialect() {

    // Set the dialect if it does not exist
    if (!this.dialect) { return super.setDialect(...arguments); }

    // Disable dialect from being changed
    throw new Error('Cannot change dialect');
  }
  // TODO: one day, in a world without `babel/polyfill`s this can use async/await
  executeQuery(query) {

    query = query.toQuery();

    debugQuery(query.text);

    return new Promise((resolve, reject) => {

      this.connection
      .then(connection => connection.executeQuery(query))
      .then(resolve);
    });
  }
  streamQuery(query) {

    query = query.toQuery();

    debugQuery(query.text);

    let stream = new Readable({ objectMode: true });
    stream._read = function () { /* Silence... */ };

    this.connection
    .then(connection => connection.streamQuery(query, stream));

    return stream;
  }
}

export default Database;
