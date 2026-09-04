import type { SlotRegistry } from '@bitdev/harmony.harmony';

/**
 * an AI provider contributed to the assistant, for example OpenAI or the
 * deterministic mock provider used when no API key is configured.
 *
 * providers are asked for structured JSON output. the assistant always passes
 * a JSON schema describing the expected shape of the answer.
 */
export type AiProvider = {
  /**
   * unique name of the provider, for example "openai" or "mock".
   */
  name: string;

  /**
   * complete a prompt, resolving to a structured object matching the schema.
   */
  complete: (prompt: string, schema?: object) => Promise<any>;
};

export type AiProviderSlot = SlotRegistry<AiProvider[]>;
