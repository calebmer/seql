import Assert from 'assert';
import {getDriver} from '../src/driver';

describe('driver getter', function () {

  it('should throw at unimplemented drivers', () =>
    Assert.throws(() => getDriver('mongodb', {}))
  );
});
