const assert = require('assert');
const { evaluateSeverity } = require('../index.js');

// Basic unit tests for rule heuristics
assert.strictEqual(evaluateSeverity({ path: '/admin', ua: 'nmap' }), 'HIGH');
assert.strictEqual(evaluateSeverity({ path: '/', ua: 'curl/7.68.0' }), 'LOW');
assert.strictEqual(evaluateSeverity({ path: '/phpinfo.php', ua: 'Mozilla/5.0' }), 'MEDIUM');

console.log('All rule tests passed');