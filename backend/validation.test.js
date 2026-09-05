const { ensureImmutable, validateReplanSchema } = require('./validation');

describe('Surgical Replanning Validation', () => {

  it('validateReplanSchema should allow only tech_stack and roadmap', () => {
    const valid = {
      tech_stack: [{ name: 'React', reason: 'Fast' }],
      roadmap: [{ week: 'Week 1', goal: 'Setup', tasks: [] }]
    };
    expect(() => validateReplanSchema(valid)).not.toThrow();

    const invalid = {
      ...valid,
      wow_factor: 'changed'
    };
    expect(() => validateReplanSchema(invalid)).toThrow(/forbidden key/);
  });

  it('ensureImmutable should throw if immutable fields change', () => {
    const original = {
      features_mvp: ['A', 'B'],
      features_stretch: ['C'],
      pitfalls: ['D'],
      wow_factor: 'E'
    };
    const updated = {
      ...original,
      wow_factor: 'E changed'
    };
    
    expect(() => ensureImmutable(original, original, ['features_mvp', 'wow_factor'])).not.toThrow();
    expect(() => ensureImmutable(original, updated, ['wow_factor'])).toThrow(/Invariant violation/);
  });

});
