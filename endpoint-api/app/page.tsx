"use client";

import { useState, FormEvent } from 'react';

export default function Home() {
  const [email, setEmail] = useState('');
  const [apiUrl, setApiUrl] = useState('');
  
  
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
      const data = await res.text(); 
      
      try {
        setResponse(JSON.parse(data));
      } catch {
        setResponse(data);
      }
    } catch (error) {
      // FIX: Check if the error is a standard Error object before reading its message
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
    <div style={{ maxWidth: '500px', margin: '50px auto', fontFamily: 'sans-serif' }}>
      <h1>One-Eleven API Tester</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        
        <label>
          <strong>Your Email Address:</strong>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </label>

        <label>
          <strong>Your Deployed API URL:</strong>
          <input 
            type="url" 
            value={apiUrl} 
            onChange={(e) => setApiUrl(e.target.value)} 
            required 
            placeholder="https://your-domain/api/sort"
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </label>

        <button type="submit" disabled={loading} style={{ padding: '10px', cursor: 'pointer' }}>
          {loading ? 'Testing...' : 'Test Endpoint'}
        </button>
      </form>

      {response && (
        <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f4f4f4', borderRadius: '5px' }}>
          <h3>Validation Response:</h3>
          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
            {typeof response === 'object' ? JSON.stringify(response, null, 2) : response}
          </pre>
        </div>
      )}
    </div>
  );
}