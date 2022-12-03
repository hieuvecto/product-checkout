import { validate } from 'class-validator';
import { FixturesQueryInput } from './fixtures_query_input.dto';

describe('FixturesQueryInput', () => {
  it('validate', () => {
    const dto = new FixturesQueryInput();

    return validate(dto)
      .then((errors) => {
        expect(errors.length).toEqual(0);
      })
      .then(() => {
        (<any>dto).orderBy = 'abc';
        return validate(dto);
      })
      .then((errors) => {
        expect(errors.length).toEqual(1);
      })
      .then(() => {
        (<any>dto).orderBy = 'createdAt';
        return validate(dto);
      })
      .then((errors) => {
        expect(errors.length).toEqual(0);
      })
      .then(() => {
        (<any>dto).orderBy = 'begunAt';
        return validate(dto);
      })
      .then((errors) => {
        expect(errors.length).toEqual(0);
      })
      .then(() => {
        (<any>dto).orderBy = 'begunAt';
        return validate(dto);
      })
      .then((errors) => {
        expect(errors.length).toEqual(0);
      })
      .then(() => {
        (<any>dto).asc = 'abc';
        return validate(dto);
      })
      .then((errors) => {
        expect(errors.length).toEqual(1);
      })
      .then(() => {
        (<any>dto).asc = true;
        return validate(dto);
      })
      .then((errors) => {
        expect(errors.length).toEqual(0);
      })
      .then(() => {
        (<any>dto).asc = false;
        return validate(dto);
      })
      .then((errors) => {
        expect(errors.length).toEqual(0);
      });
  });
});
