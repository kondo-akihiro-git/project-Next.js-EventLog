// app/logics/createLink.ts
import { v4 as uuidv4 } from "uuid";
export function createLink(clubName: string, eventName: string): string {
  const randomKey = uuidv4();
  return `${window.location.origin}/event/${randomKey}`;
}