import Assert from 'assert';
import {getConnection} from '../src/connection';

describe('connection getter', function () {

  it('should throw at unimplemented connections', () =>
    Assert.throws(() => getConnection('mongodb', {}))
  );
});
