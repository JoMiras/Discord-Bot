const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');
const { entersState, VoiceConnectionStatus } = require('@discordjs/voice');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ],
});

const CHANNEL_ID = '1103459605767532559'; // voice channel id
const LOG_CHANNEL_ID = '1103459605767532558'; // text channel id for logging

client.on('ready', async () => {
    console.log('Bot is up and ready!')
    client.user.setActivity("JonahM", {type: 2});

    const channel = client.channels.cache.get(CHANNEL_ID);
    if (!channel) return console.error('The channel does not exist!');

    const connection = joinVoiceChannel({
        channelId: CHANNEL_ID,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
    });

    try {
        await entersState(connection, VoiceConnectionStatus.Ready, 30_000);
        console.log('Connected to voice channel successfully!');
    } catch (error) {
        console.error(error);
        connection.destroy();
    }
});

client.on('message', (message) => {
    const channel = message.channel;
    const botMember = channel.guild.member(client.user);
});

client.on('voiceStateUpdate', (oldState, newState) => {
    console.log('voiceStateUpdate event triggered');
    // Check if the user joined or left the target channel
    if (oldState.channelId === CHANNEL_ID && newState.channelId !== CHANNEL_ID) {
        // User left the target channel
        const currentDate = new Date();

        const joinedAt = oldState.member.joinedAt.toLocaleString();
        const leftAt = currentDate.toLocaleString();
        const userId = oldState.member.id;

        const messageCreate = `${userId} | ${joinedAt} | ${leftAt}`;

        const logChannel = client.channels.cache.get(LOG_CHANNEL_ID);
        if (logChannel) logChannel.send(messageCreate);
    }
});
 
client.login("MTEwMzQ3MzMyODgyNTU4NTc3NA.GpTTOG.EmGwZ46bZJb9UJOxW7SmJAVviuMpztW9X5VNF8"); 
