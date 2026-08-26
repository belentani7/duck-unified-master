import registry from '../ecosystem/registry.json' with { type: 'json' };
import { EcosystemEngine } from './engine';

const engine = new EcosystemEngine(registry.systems);
const intent = process.argv.slice(2).join(' ') || 'prepare a new music project for Duck with stems, versions and an immersive experience';

console.log('\n🦆 DUCK ECOSYSTEM MACHINE\n');
console.log('INTENT:', intent);
console.log('\nSYSTEM SNAPSHOT');
console.table(engine.snapshot());

const result = engine.execute(intent);
console.log('\nPLAN');
console.table(result.actions);
console.log('\nEVENTS');
console.table(result.events);
console.log('\nNo original repository was modified by the engine.');
