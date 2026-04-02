import type { DmarcRecord, RowStatus } from './types';

// ─── Provider / infrastructure detection ─────────────────────────────────────

const PROVIDERS: Array<{ match: RegExp; name: string }> = [
  { match: /google/i, name: 'Google' },
  { match: /microsoft|outlook|hotmail|office 365/i, name: 'Microsoft' },
  { match: /yahoo/i, name: 'Yahoo' },
  { match: /amazon|aws|ses/i, name: 'Amazon SES' },
  { match: /mailchimp/i, name: 'Mailchimp' },
  { match: /sendgrid/i, name: 'SendGrid' },
  { match: /proofpoint/i, name: 'Proofpoint' },
  { match: /mimecast/i, name: 'Mimecast' },
];

const SELECTOR_INFRA: Array<{ match: RegExp; name: string }> = [
  { match: /^google|^gapps|gmail/i, name: 'Google Workspace' },
  { match: /^selector\d+\.google|^20\d{6}\.google/i, name: 'Google Workspace' },
  { match: /^s\d+\.domainkey.*amazon|^amazonses/i, name: 'Amazon SES' },
  { match: /resend/i, name: 'Resend' },
  { match: /sendgrid/i, name: 'SendGrid' },
  { match: /mailchimp|mandrill/i, name: 'Mailchimp/Mandrill' },
  { match: /hostinger/i, name: 'Hostinger' },
  { match: /brevo|sendinblue/i, name: 'Brevo' },
  { match: /postmark/i, name: 'Postmark' },
  { match: /sparkpost|messagebird/i, name: 'SparkPost' },
  { match: /mailgun/i, name: 'Mailgun' },
  { match: /klaviyo/i, name: 'Klaviyo' },
  { match: /hubspot/i, name: 'HubSpot' },
  { match: /salesforce|exacttarget/i, name: 'Salesforce' },
  { match: /zendesk/i, name: 'Zendesk' },
  { match: /zoho/i, name: 'Zoho' },
  { match: /protonmail/i, name: 'ProtonMail' },
  { match: /fastmail/i, name: 'Fastmail' },
  { match: /outlook|microsoft|office365/i, name: 'Microsoft 365' },
  { match: /yahoo/i, name: 'Yahoo Mail' },
];

export function inferSenderFromSelector(selectors: string[]): string {
  if (!selectors || selectors.length === 0) return '—';
  const joined = selectors.join(' ');
  for (const rule of SELECTOR_INFRA) {
    if (rule.match.test(joined)) return rule.name;
  }
  return selectors[0] ? selectors[0].split(/[._-]/)[0] : '—';
}

export function detectProvider(orgName: string): string {
  if (!orgName) return 'Unknown';
  for (const p of PROVIDERS) {
    if (p.match.test(orgName)) return p.name;
  }
  return orgName;
}

function tsToDate(ts: string): string {
  if (!ts) return '—';
  const d = new Date(parseInt(ts, 10) * 1000);
  return d.toISOString().slice(0, 10);
}

function getText(parent: Element | Document | null, tag: string): string {
  return parent?.querySelector(tag)?.textContent?.trim() ?? '';
}

// ─── XML Parser ───────────────────────────────────────────────────────────────

export function parseXML(xmlStr: string, filename: string): { orgName: string; dateBegin: string; dateEnd: string; records: DmarcRecord[] } {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlStr, 'application/xml');
  const err = doc.querySelector('parsererror');
  if (err) throw new Error(`XML parse error in ${filename}`);

  const meta   = doc.querySelector('report_metadata');
  const policy = doc.querySelector('policy_published');

  const orgName   = getText(meta, 'org_name');
  const dateBegin = getText(meta, 'date_range > begin') || getText(meta, 'begin');
  const dateEnd   = getText(meta, 'date_range > end')   || getText(meta, 'end');

  const records: DmarcRecord[] = [];

  doc.querySelectorAll('record').forEach(rec => {
    const row   = rec.querySelector('row');
    const ip    = getText(row, 'source_ip');
    const count = parseInt(getText(row, 'count'), 10) || 0;
    const disp  = getText(row, 'policy_evaluated > disposition');
    const dkim  = getText(row, 'policy_evaluated > dkim');
    const spf   = getText(row, 'policy_evaluated > spf');

    const authResults = rec.querySelector('auth_results');

    const dkimResults: DmarcRecord['dkimResults'] = [];
    authResults?.querySelectorAll('dkim').forEach(d => {
      dkimResults.push({
        domain:   getText(d, 'domain'),
        selector: getText(d, 'selector'),
        result:   getText(d, 'result'),
      });
    });

    const spfResults: DmarcRecord['spfResults'] = [];
    authResults?.querySelectorAll('spf').forEach(s => {
      spfResults.push({
        domain: getText(s, 'domain'),
        result: getText(s, 'result'),
        scope:  getText(s, 'scope'),
      });
    });

    const selectors = dkimResults.map(d => d.selector).filter(Boolean);
    const sender    = inferSenderFromSelector(selectors);

    records.push({
      reporter:    detectProvider(orgName),
      dateBegin:   tsToDate(dateBegin),
      dateEnd:     tsToDate(dateEnd),
      ip,
      count,
      dkim,
      spf,
      disposition: disp || 'none',
      selectors,
      sender,
      dkimResults,
      spfResults,
      policyDomain: getText(policy, 'domain'),
      policyDkim:   getText(policy, 'adkim'),
      policySpf:    getText(policy, 'aspf'),
      policyP:      getText(policy, 'p'),
    });
  });

  return { orgName: detectProvider(orgName), dateBegin, dateEnd, records };
}

// ─── Row status helper ────────────────────────────────────────────────────────

export function rowStatus(rec: DmarcRecord): RowStatus {
  const dkimPass = rec.dkim === 'pass';
  const spfPass  = rec.spf  === 'pass';
  const dispOk   = rec.disposition === 'none';
  if (dkimPass && spfPass && dispOk) return 'pass';
  if (!dkimPass && !spfPass)         return 'fail';
  if (!dispOk)                       return 'fail';
  return 'partial';
}
