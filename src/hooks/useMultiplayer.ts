import { useState, useCallback } from "react";
import usePartySocket from "partysocket/react";
import type { LeagueState } from "../types/league.ts";
import type { LeagueAction } from "../state/leagueReducer.ts";
import { initialState, migrateState } from "../state/leagueReducer.ts";

export type ConnectionStatus = "connecting" | "connected" | "disconnected";

const PARTYKIT_HOST =
  import.meta.env.VITE_PARTYKIT_HOST ?? "localhost:1999";

export function useMultiplayer(room: string) {
  const [state, setState] = useState<LeagueState>(initialState);
  const [status, setStatus] = useState<ConnectionStatus>("connecting");
  const [peerCount, setPeerCount] = useState(0);

  const ws = usePartySocket({
    host: PARTYKIT_HOST,
    room,
    onOpen() {
      setStatus("connected");
    },
    onClose() {
      setStatus("disconnected");
    },
    onMessage(event: MessageEvent) {
      const msg = JSON.parse(event.data);
      if (msg.type === "state") {
        setState(migrateState(msg.state));
      }
      if (msg.type === "peers") {
        setPeerCount(msg.count);
      }
    },
  });

  const dispatch = useCallback(
    (action: LeagueAction) => {
      ws.send(JSON.stringify({ type: "action", action }));
    },
    [ws]
  );

  return { state, dispatch, status, peerCount };
}
