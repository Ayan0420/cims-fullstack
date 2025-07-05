import Bonjour from 'bonjour';
const bonjour = new Bonjour();

bonjour.publish({
    name: 'cims-server',
    type: 'http',
    port: 4444, // host port that Docker maps to
});

console.log('Bonjour service started...');