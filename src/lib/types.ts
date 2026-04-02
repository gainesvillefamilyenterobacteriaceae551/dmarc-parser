export interface DkimResult {
  domain: string;
  selector: string;
  result: string;
}

export interface SpfResult {
  domain: string;
  result: string;
  scope: string;
}

export interface DmarcRecord {
  reporter: string;
  dateBegin: string;
  dateEnd: string;
  ip: string;
  count: number;
  dkim: string;
  spf: string;
  disposition: string;
  selectors: string[];
  sender: string;
  dkimResults: DkimResult[];
  spfResults: SpfResult[];
  policyDomain: string;
  policyDkim: string;
  policySpf: string;
  policyP: string;
}

export type RowStatus = 'pass' | 'partial' | 'fail';

export type SortDir = 'asc' | 'desc';

export type SortCol =
  | 'date'
  | 'reporter'
  | 'ip'
  | 'count'
  | 'dkim'
  | 'spf'
  | 'disposition'
  | 'selectors'
  | 'sender';
