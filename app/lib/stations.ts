// Passenger stops on the Vitebsky — Novolisino route, in line order.
export const stations = [
  "Санкт-Петербург-Витеб.",
  "Боровая",
  "Воздухоплавательный Парк",
  "Проспект Славы",
  "Купчино",
  "Шушары",
  "Паровозный музей",
  "Детскосельская",
  "Царское Село",
  "Павловск",
  "34 км",
  "Ручеёк (36 км)",
  "40 км",
  "Новолисино",
] as const;

export function isValidRoute(departure: string, arrival: string) {
  return departure !== arrival
    && stations.some((station) => station === departure)
    && stations.some((station) => station === arrival);
}
