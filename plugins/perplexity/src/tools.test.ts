// SPDX-FileCopyrightText: 2026 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0
import { ChatContext, initializeLogger, llm } from '@livekit/agents';
import type OpenAI from 'openai';
import { describe, expect, it } from 'vitest';
import { LLM } from './responses/llm.js';
import { FetchUrl, WebSearch } from './tools.js';

initializeLogger({ level: 'silent', pretty: false });

describe('Perplexity provider tools', () => {
  it('sends web_search and fetch_url with only the options that are set', async () => {
    const requests: Record<string, unknown>[] = [];
    const client = {
      responses: {
        create: async (body: Record<string, unknown>) => {
          requests.push(body);
          return {
            async *[Symbol.asyncIterator]() {
              yield { type: 'response.created', response: { id: 'resp_1' } };
              yield { type: 'response.completed', response: { id: 'resp_1' } };
            },
          };
        },
      },
    };
    const model = new LLM({ client: client as unknown as OpenAI });

    const chatCtx = ChatContext.empty();
    chatCtx.addMessage({ role: 'user', content: 'hi' });
    const stream = model.chat({
      chatCtx,
      toolCtx: new llm.ToolContext([
        new WebSearch({ searchType: 'fast', filters: { search_recency_filter: 'week' } }),
        new FetchUrl(),
      ]),
    });
    for await (const _chunk of stream) {
      void _chunk;
    }

    expect(requests[0]?.tools).toEqual([
      { type: 'web_search', search_type: 'fast', filters: { search_recency_filter: 'week' } },
      { type: 'fetch_url' },
    ]);
  });
});
