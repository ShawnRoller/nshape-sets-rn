export const getRemainingSetsDescription = (currentSet: number, sets: number): string => {
  const remainingSets = currentSet === sets ? "Last Set" : `${sets - currentSet}`;
  return remainingSets;
};

export const getNextSetDescription = (currentSet: number, sets: number): string => {
  const nextSet = currentSet === sets - 1 ? "Last Set" : `${currentSet + 1} of ${sets}`;
  return nextSet;
};

export const getElapsedTime = (timeInSeconds: number): string => {
  const minutes = `${Math.floor(timeInSeconds / 60 % 60)}`.padStart(2, "0");
  const seconds = `${timeInSeconds % 60}`.padStart(2, "0");
  const time = `${minutes}:${seconds}`;
  return time;
};

export const getTimeElapsedFromStart = (startDate: Date): string => {
  const currentDate = new Date();
  const elapsedSeconds = (currentDate.getTime() - startDate.getTime()) / 1000
  const time = getElapsedTime(Math.round(elapsedSeconds));
  return time;
};
