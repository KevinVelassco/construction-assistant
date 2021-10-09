/* eslint-disable no-unused-vars */
export enum TimeType {
  Days = 'd',
  Hours = 'h',
  Minutes = 'm'
}

export const addTimeToDate = (
  date: Date,
  time: number,
  type: TimeType
): Date => {
  const dayInHours = 24;
  const hourinMinutes = 60;
  const minuteInMillisecond = 60000;

  const timeSettingAccordingType = {
    d: dayInHours * hourinMinutes * minuteInMillisecond,
    h: hourinMinutes * minuteInMillisecond,
    m: minuteInMillisecond
  };

  const extraTime = time * timeSettingAccordingType[type];

  return new Date(date.getTime() + extraTime);
};
