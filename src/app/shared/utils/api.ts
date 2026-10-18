const baseRoute = 'https://challenge.outsera.tech/api/movies';

export const routes = {
  MOVIES: baseRoute,
  YEARS_WITH_MULTIPLE_WINNERS: `${baseRoute}/yearsWithMultipleWinners`,
  WINNERS_BY_YEAR: `${baseRoute}/winnersByYear`,
  STUDIOS_WITH_WIN_COUNT: `${baseRoute}/studiosWithWinCount`,
  MAX_MIN_INTERVAL_FOR_PRODUCERS: `${baseRoute}/maxMinWinIntervalForProducers`,
};
