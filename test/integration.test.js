import Assert from 'assert';
import Seql from '../src';

let connections = [
  'sqlite://db.test.sqlite'
];

for (let connection of connections) {
  let database = new Seql(connection);

  describe(`a ${database.dialectName} database`, () => {

    let Person = database.define({
      name: 'person',
      columns: [{
        name: 'id',
        dataType: 'integer',
        type: 'serial',
        notNull: true,
        primaryKey: true
      }, {
        name: 'name',
        dataType: 'varchar(64)',
        notNull: true
      }]
    });

    let people = Object.freeze([
      { name: 'Jim' },
      { name: 'Sara' },
      { name: 'Joe' },
      { name: 'Jill' }
    ]);

    it('can execute a query', done =>
      Person.create().exec()
      .catch(done)
      .then(() => Person.insert(people).exec())
      .then(() => Person.select().exec())
      .then(rows => {

        for (let index in rows) { Assert.equal(rows[index].name, people[index].name); }
        done();
      })
    );

    it('can stream a query', done => {

      let currentPersonIndex = 0;
      let stream = Person.select().stream();

      stream.on('error', done);

      stream.on('data', row => {

        Assert.equal(row.name, people[currentPersonIndex].name);
        currentPersonIndex += 1;
      });

      stream.on('end', () => {

        Assert.equal(currentPersonIndex, people.length);
        done();
      });
    });
  });
}
