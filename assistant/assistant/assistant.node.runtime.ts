import { randomUUID } from 'crypto';

export class AssistantNode {
  static dependencies = [];
  static async provider() {
    return new AssistantNode();
  }
}

export default AssistantNode;
