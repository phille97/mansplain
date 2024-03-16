export type Human = {
  name?: string;
  age?: string;
  location?: string;
}

export type CallSummary = {
  eid: string;
  when: number;
  summary: string;
}

export type Log = {
  who: 'bot' | 'human';
  text: string;
}

export type Call = {
  eid: string;
  initiated: number;
  log: Log[];
}

export type Experience = {
  uid: string;

  human: Human;

  previousCalls: CallSummary[];

  currentCall?: Call
}