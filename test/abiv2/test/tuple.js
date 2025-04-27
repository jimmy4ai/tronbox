const { assert } = require('chai');
const Tuple = artifacts.require('./Tuple.sol');

// The following tests require TronBox >= 2.1.x

contract('Tuple', function (accounts) {
  let tuple;

  function turnBN2N(values) {
    if (values instanceof Array) {
      return values.map(turnBN2N);
    }
    if (values._isBigNumber) return values.toNumber();
    if (typeof values === 'bigint') return Number(values);
    return values;
  }

  before(async function () {
    tuple = await Tuple.deployed();
  });

  it('should have 3 `person`s with `Tom` which is the first to verify that the argument passed to constructor works', async function () {
    assert.deepEqual(turnBN2N(await tuple.getPerson()), [
      ['Tom', 30],
      ['Lily', 20],
      ['Oscar', 30]
    ]);
  });

  it('should get `Tom 30` to verify getPersonById is working', async function () {
    const person = await tuple.getPersonById(0);
    assert.deepEqual(turnBN2N(person), ['Tom', 30]);
  });

  it('should return the same person', async function () {
    const person1 = ['return', 101];
    const person2 = turnBN2N(await tuple.getPerson2(person1));
    assert.deepEqual(person1, person2);
  });

  it('should insert person', async function () {
    const lastPersons = turnBN2N(await tuple.getPerson());
    const person1 = ['insert', 100];
    await tuple.insert(person1);
    const person2 = [['insert', 101]];
    await tuple.insert(person2);
    const persons = turnBN2N(await tuple.getPerson());
    assert.deepEqual(lastPersons.concat([person1, ...person2]), persons);
  });

  it('should insert persons', async function () {
    const lastPersons = turnBN2N(await tuple.getPerson());
    const persons1 = [
      ['insert2', 99],
      ['insert3', 98]
    ];
    await tuple.insertBatch(persons1);
    const persons2 = turnBN2N(await tuple.getPerson());
    assert.deepEqual(lastPersons.concat(persons1), persons2);
  });
});
