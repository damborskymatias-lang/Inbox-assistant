export const Aspect = {
  create: (config: { id: string }) => config,
};

export const AssistantAspect = Aspect.create({
  id: 'lov.assistant/assistant',
})
