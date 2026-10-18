export interface YearsWithMultipleWinnersYears {
  year: number;
  winnerCount: number;
}

export interface YearsWithMultipleWinners {
  years: YearsWithMultipleWinnersYears[];
}

export interface StudiosWithWinCountStudios {
  name: string;
  winCount: number;
}

export interface StudiosWithWinCount {
  studios: StudiosWithWinCountStudios[];
}

export interface maxMinWinIntervalForProducersData {
  producer: string;
  interval: number;
  previousWin: number;
  followingWin: number;
}

export interface maxMinWinIntervalForProducers {
  min: maxMinWinIntervalForProducersData[];
  max: maxMinWinIntervalForProducersData[];
}
