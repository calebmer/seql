import Assert from 'assert';
import Node from 'sql/lib/node';
import Database from './database';

_proxyDatabase('executeQuery', 'exec');
_proxyDatabase('streamQuery', 'stream');

function _proxyDatabase(method, ...aliases) {

  Node.prototype[method] = function () {

    Assert(this.sql instanceof Database, 'Cannot get database');
    return this.sql[method](this);
  };

  // Alias for easy access
  for (let alias of aliases) {
    Node.prototype[alias] = Node.prototype[method];
  }
}
