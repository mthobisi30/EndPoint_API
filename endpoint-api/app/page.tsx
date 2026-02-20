"use client";

import { useState } from "react";
import styles from "./page.module.css";

interface ValidationResponse {
  success?: boolean;
  message?: string;
  result?: unknown;
  error?: string;
  [key: string]: unknown;
}

export default function Home() {
  const [email, setEmail] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<ValidationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [localTest, setLocalTest] = useState("");
  const [localResult, setLocalResult] = useState<string[] | null>(null);

  const handleValidation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !url) return;
    setLoading(true);
    setResponse(null);
    setError(null);

    try {
      const validationUrl = `https://yhxzjyykdsfkdrmdxgho.supabase.co/functions/v1/junior-dev?url=${encodeURIComponent(url)}&email=${encodeURIComponent(email)}`;
      const res = await fetch(validationUrl);
      const data = await res.json();
      setResponse(data);
    } catch {
      setError("Failed to reach the validation endpoint. Check your URL and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLocalTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!localTest) return;
    setLocalResult(null);

    try {
      const res = await fetch("/api/sort", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: localTest }),
      });
      const data = await res.json();
      setLocalResult(data.word);
    } catch {
      setError("Local API call failed.");
    }
  };

  return (
    <main className={styles.main}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.logoMark}>
          <span className={styles.chevron}>◀◀◀</span>
          <div className={styles.logoText}>
            <span>ONE</span>
            <span>ELEVEN</span>
          </div>
        </div>
        <div className={styles.headerMeta}>
          <span>JUNIOR DEV TASK</span>
          <span className={styles.dot}>●</span>
          <span>API TESTER</span>
        </div>
      </header>

      <div className={styles.grid}>
        {/* Left: Local tester */}
        <section className={styles.card}>
          <div className={styles.cardLabel}>01 — LOCAL API TEST</div>
          <h2 className={styles.cardTitle}>Sort Your String</h2>
          <p className={styles.cardDesc}>
            Test the <code className={styles.code}>/api/sort</code> endpoint directly. Enter any string and see it sorted alphabetically.
          </p>
          <form onSubmit={handleLocalTest} className={styles.form}>
            <div className={styles.field}>
              <label className={styles.label}>INPUT STRING</label>
              <input
                type="text"
                value={localTest}
                onChange={(e) => setLocalTest(e.target.value)}
                placeholder="e.g. example"
                className={styles.input}
              />
            </div>
            <button type="submit" className={styles.btn} disabled={!localTest}>
              RUN SORT
            </button>
          </form>

          {localResult && (
            <div className={styles.result}>
              <div className={styles.resultLabel}>RESPONSE</div>
              <div className={styles.resultBox}>
                <div className={styles.resultRow}>
                  <span className={styles.key}>"word"</span>
                  <span className={styles.colon}>:</span>
                  <span className={styles.value}>
                    [&nbsp;
                    {localResult.map((char, i) => (
                      <span key={i} className={styles.char}>
                        &quot;{char}&quot;{i < localResult.length - 1 ? ", " : ""}
                      </span>
                    ))}
                    &nbsp;]
                  </span>
                </div>
              </div>
              <div className={styles.wordDisplay}>
                {localResult.map((c, i) => (
                  <span key={i} className={styles.charBadge}>{c}</span>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Right: Validation tester */}
        <section className={styles.card}>
          <div className={styles.cardLabel}>02 — VALIDATION ENDPOINT</div>
          <h2 className={styles.cardTitle}>Submit for Review</h2>
          <p className={styles.cardDesc}>
            Enter your deployed API URL and email to run the One Eleven validation test.
          </p>
          <form onSubmit={handleValidation} className={styles.form}>
            <div className={styles.field}>
              <label className={styles.label}>YOUR API ENDPOINT URL</label>
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://your-app.vercel.app/api/sort"
                className={styles.input}
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>YOUR EMAIL ADDRESS</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                className={styles.input}
              />
            </div>
            <button
              type="submit"
              className={`${styles.btn} ${styles.btnRed}`}
              disabled={loading || !email || !url}
            >
              {loading ? (
                <span className={styles.spinner}>TESTING<span className={styles.dots}>...</span></span>
              ) : (
                "SUBMIT & VALIDATE"
              )}
            </button>
          </form>

          {error && (
            <div className={styles.errorBox}>
              <span className={styles.errorIcon}>✕</span> {error}
            </div>
          )}

          {response && (
            <div className={styles.result}>
              <div className={styles.resultLabel}>VALIDATION RESPONSE</div>
              <pre className={styles.pre}>{JSON.stringify(response, null, 2)}</pre>
            </div>
          )}
        </section>
      </div>

      {/* Endpoint reference */}
      <section className={styles.reference}>
        <div className={styles.refLabel}>ENDPOINT SPEC</div>
        <div className={styles.refGrid}>
          <div className={styles.refItem}>
            <span className={styles.refKey}>METHOD</span>
            <span className={`${styles.refVal} ${styles.refBadge}`}>POST</span>
          </div>
          <div className={styles.refItem}>
            <span className={styles.refKey}>PATH</span>
            <code className={styles.refCode}>/api/sort</code>
          </div>
          <div className={styles.refItem}>
            <span className={styles.refKey}>BODY</span>
            <code className={styles.refCode}>{"{ data: string }"}</code>
          </div>
          <div className={styles.refItem}>
            <span className={styles.refKey}>RETURNS</span>
            <code className={styles.refCode}>{"{ word: string[] }"}</code>
          </div>
        </div>
      </section>
    </main>
  );
}