export async function deliverPending(store, { url, token, fetcher = fetch, now = Date.now() }) {
  if (!url) return;
  for (const request of store.pending(now)) {
    try {
      const response = await fetcher(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Idempotency-Key': request.id, ...(token ? { Authorization: `Bearer ${token}` } : {}) },
        body: JSON.stringify({
          event: 'dentistry.request.created', id: request.id,
          phone: request.phone, name: request.name,
          createdAt: new Date(request.created_at).toISOString(),
          consentVersion: request.consent_version
        }),
        signal: AbortSignal.timeout(5000),
        redirect: 'error'
      });
      if (!response.ok) throw new Error('Delivery failed');
      store.delivered(request.id);
    } catch {
      store.retry(request.id, request.attempts, now);
      // В журнал не выводятся телефоны, имена, токены или адрес webhook.
      console.warn('Request notification queued for retry.');
    }
  }
}
