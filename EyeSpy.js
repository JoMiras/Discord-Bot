const { Client, GatewayIntentBits, ActivityType } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

const logChannelId = '1125994228275744809';  // Channel Id for logging hours & date
const outputChannelId = '1125994301587996835'; // Channel Id for hours output & date

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
  client.user.setPresence({
    activities: [{ name: 'JonahM <3', type: ActivityType.Listening }],
    status: 'online',
  });
});

client.on('messageCreate', (message) => {
  if (message.author.bot) return; // Ignore messages from bots

  // Checking if message begins with !log command
  if (message.content.startsWith('!log')) {
    const now = new Date();
    const options = {
      weekday: 'long',
      month: 'numeric',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    };
    const timestamp = now.toLocaleString('en-US', options); // Formatted timestamp

    // Entry log within logging channel
    const logChannel = client.channels.cache.get(logChannelId);
    logChannel.send(`[${timestamp}] ${message.author.username} logged their hours.`)
      .then((sentMessage) => {
        // Reacting with a green check mark
        sentMessage.react('✅');

        // Delayed farewell message after 20 minutes
        setTimeout(() => {
          logChannel.send("Thank you for your attendance! Good luck, and let's work hard together!");
        }, 20 * 60 * 1000); // 20 minutes delay
      });
  } else if (message.content.startsWith('!stop')) {
    // Command to stop the bot
    const outputChannel = client.channels.cache.get(outputChannelId);
    outputChannel.send("Alrighty! It’s time for me to go to sleep. See you later!")
      .then(() => {
        client.destroy(); // Stop the bot
      });
  }
});

client.login('you have to ask me for this info');
