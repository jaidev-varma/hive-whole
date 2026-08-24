/**
 * Helper to send push notifications via Expo's Push API.
 * Expo handles forwarding these to FCM (Android) and APNs (iOS).
 */

const sendPushNotifications = async (tokens, payload) => {
  // Filter out invalid/empty tokens
  const validTokens = tokens.filter(
    (token) => typeof token === "string" && token.startsWith("ExponentPushToken")
  );

  if (validTokens.length === 0) {
    console.log("No valid Expo push tokens found. Skipping notification dispatch.");
    return;
  }

  console.log(`Sending push notifications to ${validTokens.length} devices...`);

  // Build the message array
  const messages = validTokens.map((token) => ({
    to: token,
    sound: "default",
    title: payload.title,
    body: payload.body,
    data: payload.data || {},
    priority: "high",
    channelId: "default",
  }));

  // Chunk the messages into groups of 100 (Expo API limit)
  const chunks = [];
  const chunkSize = 100;
  for (let i = 0; i < messages.length; i += chunkSize) {
    chunks.push(messages.slice(i, i + chunkSize));
  }

  // Dispatch chunks
  for (const chunk of chunks) {
    try {
      const response = await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Accept-encoding": "gzip, deflate",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(chunk),
      });

      const result = await response.json();
      console.log("Expo Push notification response:", JSON.stringify(result));
    } catch (error) {
      console.error("Error sending push notification chunk to Expo:", error);
    }
  }
};

module.exports = {
  sendPushNotifications,
};
