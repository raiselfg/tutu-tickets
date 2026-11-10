"use client";

import { useRef, useState, type FormEvent } from "react";
import { createTicket } from "../lib/ticket-db";
import { isValidRoute, stations } from "../lib/stations";

export default function CreateTicket() {
  const [departure, setDeparture] = useState("");
  const [arrival, setArrival] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const submitting = useRef(false);
  const sameStation = departure !== "" && departure === arrival;
  const valid = isValidRoute(departure, arrival);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!valid || submitting.current) return;
    submitting.current = true;
    setSaving(true);
    setError("");
    try {
      const ticket = await createTicket(departure, arrival);
      window.location.replace(`/ticket?number=${ticket.number}`);
    } catch {
      setError("Не удалось сохранить билет. Попробуйте ещё раз.");
      submitting.current = false;
      setSaving(false);
    }
  }

  return (
    <form className="create-ticket-form" onSubmit={onSubmit} aria-busy={saving}>
      <label htmlFor="departure">Станция отправления</label>
      <select id="departure" value={departure} onChange={(event) => setDeparture(event.target.value)} required disabled={saving}>
        <option value="" disabled>Выберите станцию</option>
        {stations.map((station) => <option key={station} value={station}>{station}</option>)}
      </select>

      <label htmlFor="arrival">Станция прибытия</label>
      <select id="arrival" value={arrival} onChange={(event) => setArrival(event.target.value)} required disabled={saving} aria-invalid={sameStation} aria-describedby={sameStation ? "route-error" : undefined}>
        <option value="" disabled>Выберите станцию</option>
        {stations.map((station) => <option key={station} value={station}>{station}</option>)}
      </select>

      {sameStation && <p id="route-error" className="form-error" role="alert">Станции отправления и прибытия должны различаться.</p>}
      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="create-ticket-submit" type="submit" disabled={!valid || saving}>{saving ? "Создаём билет…" : "Создать билет"}</button>
    </form>
  );
}
