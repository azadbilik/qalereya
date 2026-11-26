// Wikidata SPARQL helper
export async function sparql(q, tries = 3) {
  for (let i = 0; i < tries; i++) {
    const r = await fetch('https://query.wikidata.org/sparql', {
      method: 'POST',
      headers: { 'content-type': 'application/x-www-form-urlencoded', accept: 'application/sparql-results+json', 'user-agent': 'azadbilik-qalereya/0.1 (https://github.com/azadbilik/qalereya)' },
      body: new URLSearchParams({ query: q }),
    });
    if (r.ok) return (await r.json()).results.bindings;
    await new Promise((s) => setTimeout(s, 5000 * (i + 1)));
  }
  throw new Error('sparql failed');
}
