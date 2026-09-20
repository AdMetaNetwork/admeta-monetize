'use client';

import { useState } from 'react';
import { useChat } from '@ai-sdk/react';
import type { UIMessage } from 'ai';
import type { DisplayOffer } from '@/lib/admeta/types';
import { SponsoredOffer } from './SponsoredOffer';

const seedMessages: UIMessage[] = [
  {
    id: 'demo-user',
    role: 'user',
    parts: [{ type: 'text', text: "I'm going to Switzerland for a week. What eSIM should I use?" }],
  },
  {
    id: 'demo-assistant',
    role: 'assistant',
    parts: [
      {
        type: 'text',
        text:
          'For a week in Switzerland, 5–10 GB is usually enough for maps, messaging and light browsing. Look for a regional Europe plan that explicitly includes Switzerland, supports hotspot use, and activates on first connection. Compare coverage and expiry before you buy.',
      },
    ],
  },
];

export function TravelChat({ offer, clickCount }: { offer: DisplayOffer | null; clickCount: number }) {
  const [input, setInput] = useState('');
  const { messages, sendMessage, status, error } = useChat({ messages: seedMessages });
  const busy = status === 'submitted' || status === 'streaming';

  return (
    <div className="demo-shell">
      <section className="chat-panel">
        <header className="chat-header">
          <div className="brand-lockup">
            <span className="brand-mark" aria-hidden="true">R</span>
            <div><strong>Roam</strong><span>AI travel assistant</span></div>
          </div>
          <span className="status"><i /> Online</span>
        </header>

        <div className="messages" aria-live="polite">
          <div className="day-label"><span>Today</span></div>
          {messages.map((message, index) => (
            <div className={`message-row ${message.role}`} key={message.id}>
              {message.role === 'assistant' && <span className="avatar" aria-hidden="true">R</span>}
              <div className={`message ${message.role}`}>
                {message.parts.map((part, partIndex) =>
                  part.type === 'text' ? <p key={`${message.id}-${partIndex}`}>{part.text}</p> : null,
                )}
                {message.role === 'assistant' && index === 1 && offer ? <SponsoredOffer offer={offer} /> : null}
              </div>
            </div>
          ))}
          {busy && <p className="thinking">Roam is thinking…</p>}
          {error && <p className="error">Add an AI Gateway key to send new messages. The seeded demo remains available.</p>}
        </div>

        <form
          className="composer"
          onSubmit={(event) => {
            event.preventDefault();
            const text = input.trim();
            if (!text || busy) return;
            void sendMessage({ text });
            setInput('');
          }}
        >
          <label className="sr-only" htmlFor="travel-question">Ask a travel question</label>
          <input
            id="travel-question"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ask about your trip…"
          />
          <button type="submit" aria-label="Send message" disabled={busy || !input.trim()}>↑</button>
        </form>
        <p className="chat-note">Roam may make mistakes. Check important travel details.</p>
      </section>

      <aside className="developer-panel">
        <div className="sandbox-heading"><span className="pulse" /> admeta Sandbox</div>
        <p className="sandbox-copy">Local commercial interaction telemetry</p>
        <dl className="metrics">
          <div><dt>Impressions</dt><dd>{offer ? 1 : 0}</dd></div>
          <div><dt>Clicks</dt><dd>{clickCount}</dd></div>
          <div><dt>Conversions</dt><dd>—</dd></div>
          <div><dt>Revenue</dt><dd>—</dd></div>
        </dl>
        <div className="event-log">
          <p>Latest event</p>
          <code>{clickCount > 0 ? 'click.receipt_created' : 'offer.impression'}</code>
        </div>
        <p className="connect-note">Sandbox is fictional. Use BYO only with a real commercial relationship.</p>
      </aside>
    </div>
  );
}
