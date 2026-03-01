import dayjs from 'dayjs';

const regex = /^(\d+)([dwmyh])$/;
const unitMap = {
    d: "day",
    w: "week",
    m: "month",
    y: "year",
    h: "hour",
  };

export default (expression:string, date:Date = new Date()): Date => {

    const match = expression.match(regex);

    if(!match) throw new Error('Invalid date expression');

    const value = parseInt(match[1]);

    const unit = unitMap[match[2]]

    return dayjs(date).add(value, unit).toDate();
}