import { assert } from 'chai';
import ABExperiment from '../src/ab-experiment';

describe('ABExperiment test.', () => {
  it('should instantiate ABExperiment', () => {
    assert(typeof new ABExperiment({provider:"optimizely"}) === "object");
  });
});
