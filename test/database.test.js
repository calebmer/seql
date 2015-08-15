import Assert from 'assert';
import {Database} from '../src';

describe('a database', function () {

  it('will accept an object connection config', () => new Database({ dialect: 'sqlite', storage: 'db.test.sqlite' }));
  it('will accept a string connection config', () => new Database('sqlite://db.test.sqlite'));

  it('requires a dialect', () => {

    Assert.throws(() => new Database());
    Assert.throws(() => new Database(42));
    Assert.throws(() => new Database({ a: 1, b: '2' }));
    Assert.throws(() => new Database('db.test.sqlite'));

    new Database({ dialect: 'sqlite' });
    new Database('sqlite://db.test.sqlite');
  });

  it('does not support dialects `node-sql` does not support', () =>
    Assert.throws(() => new Database('mongodb://db.mongo'))
  );

  it('cannot have its dialect changed', () =>
    Assert.throws(() => new Database('sqlite://db.test.sqlite').setDialect('sqlite://db.sqlite'))
  );
});
