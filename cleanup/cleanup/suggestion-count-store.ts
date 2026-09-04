const LIST_SUGGESTIONS_QUERY = `
  query ListSuggestionCount {
    listSuggestions {
      id
    }
  }
`;

/**
 * a tiny store keeping the amount of open cleanup suggestions, used to render
 * the badge of the "Cleanup" navigation item. the sidebar reads the value
 * synchronously while the store refreshes it in the background, so no react
 * hook is required inside the slot callback.
 */
export class SuggestionCountStore {
  private suggestionCount: number | undefined = undefined;

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
   * the last known amount of cleanup suggestions, triggering a background
   * refresh once the cached value became stale.
   */
  getCount(): number | undefined {
    this.refresh();
    return this.suggestionCount;
  }

  /**
   * refresh the suggestion count from the graphql api, throttled by the
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
      body: JSON.stringify({ query: LIST_SUGGESTIONS_QUERY }),
    })
      .then((response) => (response.ok ? response.json() : undefined))
      .then((payload) => {
        const suggestions = payload?.data?.listSuggestions;
        const count = Array.isArray(suggestions) ? suggestions.length : 0;
        this.suggestionCount = count > 0 ? count : undefined;
      })
      .catch(() => {
        this.suggestionCount = undefined;
      })
      .finally(() => {
        this.inFlight = false;
      });
  }
}
