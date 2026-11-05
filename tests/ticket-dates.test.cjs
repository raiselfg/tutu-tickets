const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { resolve } = require("node:path");
const { after, before, test } = require("node:test");
const { transformSync } = require("esbuild");

let getTicketDates;
let getTicketDate;
let checkedPurchases = 0;

before(async () => {
  const source = readFileSync(resolve(__dirname, "../app/lib/tickets.ts"), "utf8");
  const { code } = transformSync(source, { loader: "ts", format: "esm" });
  ({ getTicketDates, getTicketDate } = await import(`data:text/javascript;base64,${Buffer.from(code).toString("base64")}`));
});

const months = [
  "января", "февраля", "марта", "апреля", "мая", "июня",
  "июля", "августа", "сентября", "октября", "ноября", "декабря",
];
const timeZones = [
  "UTC", "Europe/Moscow", "America/New_York", "America/Los_Angeles",
  "Europe/Berlin", "Australia/Lord_Howe", "Asia/Kathmandu", "Pacific/Kiritimati",
];
const times = [
  [0, 0, 0, 0], [0, 30, 0, 0], [0, 59, 59, 999],
  [1, 0, 0, 0], [12, 0, 0, 0], [23, 59, 59, 999],
];

function inTimeZone(timeZone, run) {
  const previous = process.env.TZ;
  process.env.TZ = timeZone;
  try {
    run();
  } finally {
    if (previous === undefined) delete process.env.TZ;
    else process.env.TZ = previous;
  }
}

// Independent Gregorian calendar expectations; do not calculate the expected
// next day with the Date constructor used by the application.
function daysInMonth(year, month) {
  if (month === 2) return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0) ? 29 : 28;
  return [4, 6, 9, 11].includes(month) ? 30 : 31;
}

function nextDay(year, month, day) {
  if (day < daysInMonth(year, month)) return [year, month, day + 1];
  if (month < 12) return [year, month + 1, 1];
  return [year + 1, 1, 1];
}

function isoDay(year, month, day) {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function checkDay(year, month, day) {
  const travelDate = isoDay(year, month, day);
  assert.equal(getTicketDate({ travelDate }), `${day} ${months[month - 1]}`, travelDate);
  const expectedNext = nextDay(year, month, day);

  for (const [hour, minute, second, millisecond] of times) {
    checkedPurchases++;
    const created = new Date(year, month - 1, day, hour, minute, second, millisecond);
    const result = getTicketDates(created);
    const context = `${process.env.TZ} ${travelDate} ${hour}:${minute}:${second}.${millisecond}`;
    assert.equal(result.travelDate, travelDate, context);
    assert.equal(result.createdAt, created.getTime(), context);
    const expiry = new Date(result.expiresAt);
    assert.deepEqual([expiry.getFullYear(), expiry.getMonth() + 1, expiry.getDate()], expectedNext, context);
    assert.deepEqual([expiry.getHours(), expiry.getMinutes(), expiry.getSeconds(), expiry.getMilliseconds()], [1, 0, 0, 0], context);
    assert(result.expiresAt > result.createdAt, context);
    assert.equal(getTicketDate({ travelDate: result.travelDate }), `${day} ${months[month - 1]}`, context);
  }
}

for (const timeZone of timeZones) {
  test(`every date and six purchase times in 2024–2032: ${timeZone}`, () => {
    inTimeZone(timeZone, () => {
      for (let year = 2024; year <= 2032; year++) {
        for (let month = 1; month <= 12; month++) {
          for (let day = 1; day <= daysInMonth(year, month); day++) checkDay(year, month, day);
        }
      }
    });
  });
}

test("century leap-year rules: 2000 and 2400 are leap years; 2100 is not", () => {
  inTimeZone("Europe/Moscow", () => {
    checkDay(2000, 2, 28);
    checkDay(2000, 2, 29);
    checkDay(2100, 2, 28);
    checkDay(2400, 2, 28);
    checkDay(2400, 2, 29);
  });
});

test("the stored calendar date does not shift when the device time zone changes", () => {
  for (const travelDate of ["2026-01-01", "2026-12-31", "2028-02-29"]) {
    const [, month, day] = travelDate.split("-").map(Number);
    for (const timeZone of timeZones) {
      inTimeZone(timeZone, () => assert.equal(getTicketDate({ travelDate }), `${day} ${months[month - 1]}`));
    }
  }
});

const transitions = [
  ["America/New_York", "2026-03-08T00:30:00-05:00", "2026-03-09T05:00:00.000Z", 23.5],
  ["America/New_York", "2026-11-01T00:30:00-04:00", "2026-11-02T06:00:00.000Z", 25.5],
  ["America/New_York", "2026-10-31T23:30:00-04:00", "2026-11-01T05:00:00.000Z", 1.5],
  ["Europe/Berlin", "2026-03-29T00:30:00+01:00", "2026-03-29T23:00:00.000Z", 23.5],
  ["Europe/Berlin", "2026-10-25T00:30:00+02:00", "2026-10-26T00:00:00.000Z", 25.5],
  ["Australia/Lord_Howe", "2026-10-04T00:30:00+10:30", "2026-10-04T14:00:00.000Z", 24],
  ["Australia/Lord_Howe", "2026-04-05T00:30:00+11:00", "2026-04-05T14:30:00.000Z", 25],
];

for (const [timeZone, input, expected, hours] of transitions) {
  test(`next-day 01:00 across daylight saving change: ${timeZone}, ${input}`, () => {
    inTimeZone(timeZone, () => {
      const created = new Date(input);
      const result = getTicketDates(created);
      assert.equal(new Date(result.expiresAt).toISOString(), expected);
      assert.equal((result.expiresAt - created.getTime()) / 3_600_000, hours);
    });
  });
}

after(() => {
  assert.equal(checkedPurchases, 157_854);
  console.log(`Checked ${checkedPurchases} purchase-date combinations, 12 Russian month forms, 8 time zones and 7 DST boundaries.`);
});
