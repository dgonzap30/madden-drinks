import type * as Party from "partykit/server";
import { leagueReducer, initialState, migrateState } from "../src/state/leagueReducer";
import type { LeagueState } from "../src/types/league";
import type { LeagueAction } from "../src/state/leagueReducer";

type ClientMessage =
  | { type: "action"; action: LeagueAction }
  | { type: "request-state" };

type ServerMessage =
  | { type: "state"; state: LeagueState }
  | { type: "peers"; count: number };

const STORAGE_KEY = "league-state";

export default class MaddenDrinksServer implements Party.Server {
  state: LeagueState = { ...initialState };

  constructor(readonly room: Party.Room) {}

  async onStart() {
    const saved = await this.room.storage.get<LeagueState>(STORAGE_KEY);
    if (saved) {
      this.state = migrateState(saved);
    }
  }

  onConnect(conn: Party.Connection) {
    this.send(conn, { type: "state", state: this.state });
    this.broadcastPeerCount();
  }

  onClose() {
    this.broadcastPeerCount();
  }

  async onMessage(message: string, sender: Party.Connection) {
    const msg: ClientMessage = JSON.parse(message);

    if (msg.type === "action") {
      this.state = leagueReducer(this.state, msg.action);
      await this.room.storage.put(STORAGE_KEY, this.state);
      this.room.broadcast(
        JSON.stringify({ type: "state", state: this.state } satisfies ServerMessage)
      );
    }

    if (msg.type === "request-state") {
      this.send(sender, { type: "state", state: this.state });
    }
  }

  private send(conn: Party.Connection, msg: ServerMessage) {
    conn.send(JSON.stringify(msg));
  }

  private broadcastPeerCount() {
    const count = [...this.room.getConnections()].length;
    this.room.broadcast(
      JSON.stringify({ type: "peers", count } satisfies ServerMessage)
    );
  }
}
