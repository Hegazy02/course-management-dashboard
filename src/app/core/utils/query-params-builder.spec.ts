import { QueryParamsBuilder } from './query-params-builder';

describe('QueryParamsBuilder', () => {
  it('should build empty params when no values are set', () => {
    const params = new QueryParamsBuilder().build();
    expect(params.toString()).toBe('');
  });

  it('should set non-null values', () => {
    const params = new QueryParamsBuilder()
      .set('page', 1)
      .set('perPage', 20)
      .build();
    expect(params.get('page')).toBe('1');
    expect(params.get('perPage')).toBe('20');
  });

  it('should skip null and undefined values', () => {
    const params = new QueryParamsBuilder()
      .set('page', 1)
      .set('search', null)
      .set('status', undefined)
      .build();
    expect(params.get('page')).toBe('1');
    expect(params.get('search')).toBeNull();
    expect(params.get('status')).toBeNull();
  });

  it('should append multiple values for the same key', () => {
    const params = new QueryParamsBuilder()
      .append('tag', 'angular')
      .append('tag', 'typescript')
      .build();
    expect(params.getAll('tag')).toEqual(['angular', 'typescript']);
  });

  it('should chain set and append', () => {
    const params = new QueryParamsBuilder()
      .set('page', '1')
      .append('tag', 'a')
      .append('tag', 'b')
      .build();
    expect(params.get('page')).toBe('1');
    expect(params.getAll('tag')).toEqual(['a', 'b']);
  });
});
