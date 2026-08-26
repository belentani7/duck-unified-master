export type Mode = 'real' | 'simulated' | 'planned';

export type System = {
  id: string;
  name: string;
  repository: string;
  domain: string;
  mode: Mode;
  preserveOriginal: boolean;
  capabilities: string[];
};

export type Event = {
  id: string;
  type: string;
  source: string;
  timestamp: string;
  payload: Record<string, unknown>;
};

export type Action = {
  id: string;
  capability: string;
  systemId: string;
  mode: Mode;
  status: 'planned' | 'simulated' | 'executed';
};

export class EcosystemEngine {
  private readonly systems: System[];
  private readonly events: Event[] = [];

  constructor(systems: System[]) {
    this.systems = systems;
  }

  findCapability(capability: string): System[] {
    return this.systems.filter((system) => system.capabilities.includes(capability));
  }

  plan(intent: string): Action[] {
    const normalized = intent.toLowerCase();
    const capabilities: string[] = [];

    if (/(track|song|music|stem|mix|master|producer|producción)/.test(normalized)) {
      capabilities.push('projects', 'stems', 'versions');
    }
    if (/(visual|experience|zion|gema)/.test(normalized)) {
      capabilities.push('experience', 'toolkit');
    }
    if (/(ai|agent|automat|orchestrat)/.test(normalized)) {
      capabilities.push('agents', 'orchestration');
    }
    if (capabilities.length === 0) capabilities.push('projects');

    const unique = [...new Set(capabilities)];
    return unique.flatMap((capability, index) => {
      const system = this.findCapability(capability)[0];
      if (!system) return [];
      return [{
        id: `action-${index + 1}`,
        capability,
        systemId: system.id,
        mode: system.mode,
        status: system.mode === 'real' ? 'planned' : system.mode === 'simulated' ? 'simulated' : 'planned'
      }];
    });
  }

  execute(intent: string): { intent: string; actions: Action[]; events: Event[] } {
    const actions = this.plan(intent);
    actions.forEach((action) => {
      const event: Event = {
        id: `evt-${this.events.length + 1}`,
        type: action.mode === 'real' ? 'action.executed' : 'action.simulated',
        source: action.systemId,
        timestamp: new Date().toISOString(),
        payload: { intent, action }
      };
      this.events.push(event);
    });
    return { intent, actions, events: [...this.events] };
  }

  snapshot() {
    return {
      systems: this.systems.length,
      real: this.systems.filter((s) => s.mode === 'real').length,
      simulated: this.systems.filter((s) => s.mode === 'simulated').length,
      planned: this.systems.filter((s) => s.mode === 'planned').length,
      events: this.events.length
    };
  }
}
