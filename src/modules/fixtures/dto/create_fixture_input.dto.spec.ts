import { validate } from 'class-validator';
import parseISO from 'date-fns/parseISO';
import { DateTimeUtil } from 'src/common/dateTime/dateTime.util';
import { CreateFixtureInput } from './create_fixture_input.dto';

describe('CreateFixtureInput', () => {
  it('validate', () => {
    const dto = new CreateFixtureInput();
    dto.tournamentName = 'Champion League';
    dto.homeTeamId = 1;
    dto.awayTeamId = 2;
    dto.begunAt = DateTimeUtil.parseISOString('2022-12-16T10:30:00.000Z');
    dto.endedAt = DateTimeUtil.parseISOString('2022-12-16T12:30:00.000Z');

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
        expect(errors.length).toEqual(1);
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
        expect(errors.length).toEqual(2);
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
        expect(errors.length).toEqual(2);
      });
  });
});
