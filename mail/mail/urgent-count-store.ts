const TRIAGE_COUNTS_QUERY = `
  query GetTriageCounts {
    getTriageCounts {
      urgent
    }
  }
`;

/**
 * a tiny store keeping the amount of urgent emails, used to render the badge of
 * the "Inbox" navigation item. the sidebar reads the value synchronously while
 * the store refreshes it in the background, so no react hook is required in the
 * slot callback.
 */
export class UrgentCountStore {
  private urgentCount: number | undefined = undefined;

  private lastRefreshedAt = 0;

  private inFlight = false;

  constructor(
    /**
     * url of the graphql endpoint the count is read from.
     */
    private endpoint: string = '/graphql',

    /**
     * minimum amount of milliseconds between two refreshes.
     */
    private refreshInterval: number = 30000
  ) {}

  /**
   * the last known amount of urgent emails, triggering a background
   * refresh when the cached value became stale.
   */
  getCount(): number | undefined {
    this.refresh();
    return this.urgentCount;
  }

  /**
   * refresh the urgent count from the graphql api, throttled by the
   * configured refresh interval.
   */
  refresh(): void {
    if (typeof window === 'undefined') return;
    if (this.inFlight) return;

    const now = Date.now();
    if (this.lastRefreshedAt && now - this.lastRefreshedAt < this.refreshInterval) return;

    this.lastRefreshedAt = now;
    this.inFlight = true;

    fetch(this.endpoint, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: TRIAGE_COUNTS_QUERY }),
    })
      .then((response) => (response.ok ? response.json() : undefined))
      .then((payload) => {
        const urgent = payload?.data?.getTriageCounts?.urgent;
        this.urgentCount = typeof urgent === 'number' && urgent > 0 ? urgent : undefined;
      })
      .catch(() => {
        this.urgentCount = undefined;
      })
      .finally(() => {
        this.inFlight = false;
      });
  }
}
