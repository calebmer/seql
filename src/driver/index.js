const _drivers = {
  sqlite: './sqlite'
};

export function getDriver(dialect) {

  if (dialect in _drivers) {
    let driver = require(_drivers[dialect]);
    driver = driver.default || driver;
    driver = new driver();
    return driver;
  } else {
    throw new Error(`Driver ${dialect} not supported`);
  }
}
