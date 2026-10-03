import React from 'react';

export class AssistantBrowserRuntime {
  static slots = [];
  static dependencies = [];
  static provider() {
    return new AssistantBrowserRuntime();
  }
}

export default AssistantBrowserRuntime;
