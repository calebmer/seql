> **Important**: Database migrations are not yet implemented as I am looking for a good solution, if you have any ideas please do share :)

# Seql
SQL can get pretty tricky, there are different dialects to consider, different features to know about, these problems inevitably spawn many projects each trying to fix a different problem. Seql aims to combine some of the *best* packages out there to make using a SQL database much more painless.

Seql was also written with ES7 in mind, and also literally written in ES6. All asynchronous operations are promise based and the module is exported with ES6 consumers in mind. If you don't know ES6/7 see the [Babel reference page](https://babeljs.io/docs/learn-es2015/). If you are using ES5 and are confused on how to get this module to work, read the ["Dear ES5 User"](#dear-es5-user) note.

## Usage
### Querying
```javascript
import Seql from 'seql';

let db = new Seql('sqlite://db.sqlite');

let Person = db.define({
  name: 'person',
  columns: ['id', 'givenName', 'familyName', 'email']
});

let person = {
  givenName: 'Sara',
  familyName: 'Smith',
  email: 'sara.smith@email.com'
};

Person.insert(person).exec()
.catch(error => console.error(error.stack))
.then(() => console.log('done!'));
```

Seql extends the [`sql`](https://github.com/brianc/node-sql) module, so see that repository for more details on the querying syntax. Notable differences include `new Seql(...)` and the `.exec()` function.

### Streaming
```javascript
let stream = Person.select(person).stream();

stream.on('data', row => console.log(row));
```

The `.stream()` method returns a readable stream in object mode for your consumption.

## API
### new Database(connectionConfig)
Returns a new database instance which extends the `sql` package's `Sql` function, thus it shares all of the same methods such as `.define()`. One notable difference is that the `.setDialect()` method is disabled, this is because the dialect should be immutable, defined in the `connectionConfig` parameter and never changed.

- `connectionConfig`: A connection object or a url string. Whatever the value it is directly passed to the driver which will parse it. The dialect must be defined somewhere in the config. If it is a url string, the dialect must be the protocol, e.g. `mysql://...`. If it is an object, a dialect property must be set, e.g. `{ dialect: 'postgres' }`. For more information on what information should be included in this value, take a look at your specific driver's documentation.

### Database#executeQuery(query)
Executes a query from the `sql` package.

### Database#streamQuery(query)
Streams a query from the `sql` package.

### Node#executeQuery() || Node#exec()
Seql extends the `sql` package's API and adds this method which is just a shortcut for `Database#executeQuery(query)` where the query parameter is the node.

### Node#streamQuery() || Node#stream()
Ditto except it shortcuts `Database#streamQuery(query)`.

## Supports:
- [`sqlite3`](https://github.com/mapbox/node-sqlite3)

Want support for more databases? Submit a pull request! Mysql and Postgres are on Caleb's TODO list, if you want these drivers faster, either start an issue thread or add them yourself using the `src/driver/sqlite.js` file as your base.

## Behind the curtain
Currently Seql is using the awesome `sql` module as its base for building queries, on top of that Seql adds two methods to the `Node` function's prototype: `exec` and `stream`. In the `src/driver` folder is the implementation for these methods.

## Dear ES5 User:
To use Seql with the CommonJS API, do the following:

```javascript
var Seql = require('seql').Seql;
```

Also, this module uses [promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) instead of the traditional callbacks.
