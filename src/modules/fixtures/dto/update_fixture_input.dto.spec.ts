import { validate } from 'class-validator';
import { UpdateFixtureInput } from './update_fixture_input.dto';

describe('UpdateFixtureInput', () => {
  it('validate', () => {
    const dto = new UpdateFixtureInput();

    return validate(dto)
      .then((errors) => {
        expect(errors.length).toEqual(0);
      })
      .then(() => {
        dto.tournamentName =
          'Champion LeagueChampion LeagueChampion LeagueChampion LeagueChampion LeagueChampion LeagueChampion LeagueChampion LeagueChampion LeagueChampion LeagueChampion LeagueChampion League';
        return validate(dto);
      })
      .then((errors) => {
        expect(errors.length).toEqual(1);
      })
      .then(() => {
        dto.tournamentName = '';
        return validate(dto);
      })
      .then((errors) => {
        expect(errors.length).toEqual(0);
      })
      .then(() => {
        dto.tournamentName = 'Champion League';
        dto.homeTeamId = -1;
        dto.awayTeamId = -1;
        return validate(dto);
      })
      .then((errors) => {
        expect(errors.length).toEqual(2);
      })
      .then(() => {
        dto.homeTeamId = null;
        dto.awayTeamId = null;
        return validate(dto);
      })
      .then((errors) => {
        expect(errors.length).toEqual(0);
      })
      .then(() => {
        dto.homeTeamId = 1;
        dto.awayTeamId = 2;
        (<any>dto).begunAt = '111';
        (<any>dto).endedAt = '111';
        return validate(dto);
      })
      .then((errors) => {
        expect(errors.length).toEqual(2);
      })
      .then(() => {
        (<any>dto).begunAt = null;
        (<any>dto).endedAt = null;
        return validate(dto);
      })
      .then((errors) => {
        expect(errors.length).toEqual(0);
      })
      .then(() => {
        (<any>dto).homeTeamScore = -1;
        (<any>dto).awayTeamScore = -1;
        return validate(dto);
      })
      .then((errors) => {
        expect(errors.length).toEqual(2);
      })
      .then(() => {
        (<any>dto).homeTeamScore = 0;
        (<any>dto).awayTeamScore = 0;
        return validate(dto);
      })
      .then((errors) => {
        expect(errors.length).toEqual(0);
      })
      .then(() => {
        (<any>dto).homeTeamScore = 1;
        (<any>dto).awayTeamScore = 1;
        return validate(dto);
      })
      .then((errors) => {
        expect(errors.length).toEqual(0);
      });
  });
});
