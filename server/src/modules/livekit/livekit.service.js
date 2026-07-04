import { AccessToken } from 'livekit-server-sdk';

/**
 * Generate a LiveKit access token for a participant to join a voice room.
 * @param {string} roomName - The unique name of the room (e.g. consultationId)
 * @param {string} participantIdentity - A unique identity for the participant (e.g. userId)
 * @returns {Promise<string>} Signed LiveKit JWT token
 */
export const generateParticipantToken = async (roomName, participantIdentity) => {
  const apiKey = process.env.LIVEKIT_API_KEY || 'devkey';
  const apiSecret = process.env.LIVEKIT_API_SECRET || 'secret';

  // Instantiate the token with credentials and participant identity
  const at = new AccessToken(apiKey, apiSecret, {
    identity: participantIdentity,
  });

  // Grant permissions to join the room, publish audio, and subscribe to audio
  at.addGrant({
    roomJoin: true,
    room: roomName,
    canPublish: true,
    canSubscribe: true,
  });

  return at.toJwt();
};
