"use client";



import { useState, FormEvent } from 'react';

export default function Home() {
  // form state for the two inputs the task asks us to collect
  const [email, setEmail] = useState('');
  const [apiUrl, setApiUrl] = useState('');

  // response from the validation function and a simple loading flag
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setResponse(null);

    const baseUrl = 'https://yhxzjyykdsfkdrmdxgho.supabase.co/functions/v1/junior-dev';
    const testUrl = `${baseUrl}?url=${encodeURIComponent(apiUrl)}&email=${encodeURIComponent(email)}`;

    try {
      const res = await fetch(testUrl);
      const text = await res.text();
      try {
        setResponse(JSON.parse(text));
      } catch {
        setResponse(text);
      }
    } catch (error) {
      if (error instanceof Error) {
        setResponse(`Error: ${error.message}`);
      } else {
        setResponse('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Endpoint Validator</h1>
      <p>Enter your deployed API URL and an email address, then click "Validate".</p>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="url"
          placeholder="https://your-domain/api/sort"
          value={apiUrl}
          onChange={(e) => setApiUrl(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Validating...' : 'Validate'}
        </button>
      </form>

      {response && (
        <pre>
          {typeof response === 'object' ? JSON.stringify(response, null, 2) : response}
        </pre>
      )}
    </div>
  );
}
