// SPDX-FileCopyrightText: 2026 LiveKit, Inc.
//
// SPDX-License-Identifier: Apache-2.0
import { OpenAITool } from '@livekit/agents-plugin-openai';

/**
 * Search mode for the Perplexity web search tool.
 *
 * @public
 */
export type SearchType = 'web' | 'fast';

/**
 * Options for the Perplexity web search tool.
 *
 * @public
 */
export interface WebSearchOptions {
  /** `web` for full web search or `fast` for lower latency. */
  searchType?: SearchType;

  /** Search filters, such as `search_domain_filter` or `search_recency_filter`. */
  filters?: Record<string, unknown>;

  /** Approximate location of the user, such as city, region, country, or coordinates. */
  userLocation?: Record<string, unknown>;

  /** Maximum number of search results. */
  maxResults?: number;

  /** Maximum total tokens of page content across all results. */
  maxTokens?: number;

  /** Maximum tokens of page content per result. */
  maxTokensPerPage?: number;
}

/**
 * Search the web with the Agent API's built-in `web_search` tool.
 *
 * @see https://docs.perplexity.ai/docs/agent-api/tools/web-search
 *
 * @public
 */
export class WebSearch extends OpenAITool {
  readonly searchType: SearchType | undefined;
  readonly filters: Record<string, unknown> | undefined;
  readonly userLocation: Record<string, unknown> | undefined;
  readonly maxResults: number | undefined;
  readonly maxTokens: number | undefined;
  readonly maxTokensPerPage: number | undefined;

  constructor({
    searchType,
    filters,
    userLocation,
    maxResults,
    maxTokens,
    maxTokensPerPage,
  }: WebSearchOptions = {}) {
    super({ id: 'perplexity_web_search' });
    this.searchType = searchType;
    this.filters = filters;
    this.userLocation = userLocation;
    this.maxResults = maxResults;
    this.maxTokens = maxTokens;
    this.maxTokensPerPage = maxTokensPerPage;
  }

  toToolConfig(): Record<string, unknown> {
    const result: Record<string, unknown> = { type: 'web_search' };
    if (this.searchType !== undefined) {
      result.search_type = this.searchType;
    }
    if (this.filters !== undefined) {
      result.filters = this.filters;
    }
    if (this.userLocation !== undefined) {
      result.user_location = this.userLocation;
    }
    if (this.maxResults !== undefined) {
      result.max_results = this.maxResults;
    }
    if (this.maxTokens !== undefined) {
      result.max_tokens = this.maxTokens;
    }
    if (this.maxTokensPerPage !== undefined) {
      result.max_tokens_per_page = this.maxTokensPerPage;
    }
    return result;
  }
}

/**
 * Options for the Perplexity URL fetch tool.
 *
 * @public
 */
export interface FetchUrlOptions {
  /** Maximum number of URLs to fetch per call, from 1 to 10. */
  maxUrls?: number;
}

/**
 * Fetch the content of URLs with the Agent API's built-in `fetch_url` tool.
 *
 * @see https://docs.perplexity.ai/docs/agent-api/tools/fetch-url-content
 *
 * @public
 */
export class FetchUrl extends OpenAITool {
  readonly maxUrls: number | undefined;

  constructor({ maxUrls }: FetchUrlOptions = {}) {
    super({ id: 'perplexity_fetch_url' });
    this.maxUrls = maxUrls;
  }

  toToolConfig(): Record<string, unknown> {
    const result: Record<string, unknown> = { type: 'fetch_url' };
    if (this.maxUrls !== undefined) {
      result.max_urls = this.maxUrls;
    }
    return result;
  }
}
