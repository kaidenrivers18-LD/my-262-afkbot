const mineflayer = require('mineflayer');
const http = require('http');

// 1. DUMMY WEB ENDPOINT TO KEEP THE RENDER SERVER CONTAINER ALIVE
http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('KaiQuestAFK Drone is actively monitoring Java 26.2!\n');
}).listen(process.env.PORT || 3000);

// 2. 26.2 PROTOCOL CONFIGURATION
const botArgs = {
    host: 'kaiquest15.aternos.me', 
    username: 'KaiQuestAFK',      
    auth: 'offline',              
    version: '1.21.3',            // Explicitly locks into the 26.2 network layer
    skipValidation: true          // Forces the bot past frozen handshake screens
};

function launchBot() {
    console.log('Spawning standalone crossplay bot into the server...');
    const bot = mineflayer.createBot(botArgs);

    bot.on('spawn', () => {
        console.log(`Success! ${bot.username} entered the server gates safely.`);
        
        // Anti-AFK jumping loop to trick the idling kick filters
        setInterval(() => {
            if (bot.entity) {
                bot.setControlState('jump', true);
                setTimeout(() => bot.setControlState('jump', false), 500);
            }
        }, 15000);
    });

    bot.on('error', (err) => {
        console.log(`Network tracking error: ${err.message}`);
    });

    bot.on('end', () => {
        console.log('Bot disconnected from socket lanes. Reconnecting in 10 seconds...');
        setTimeout(launchBot, 10000);
    });
}

launchBot();
