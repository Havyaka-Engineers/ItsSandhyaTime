const axios = require('axios');

const ACCESS_TOKEN = 'c503e2f0f8909927ae4b9e2f97094044';

async function getVimeoVideoDuration(videoId) {
  try {
    const response = await axios.get(`https://api.vimeo.com/videos/${videoId}`, {
      headers: {
        'Authorization': `bearer ${ACCESS_TOKEN}`
      }
    });
    return response.data.duration; // Duration in seconds
  } catch (error) {
    console.error(`Error fetching duration for video ${videoId}:`, error);
    return -1; // Return -1 to indicate error
  }
}

async function getAllVideoDurations(videoIds) {
  const results = [];
  
  // Process videos sequentially to avoid rate limiting
  for (const videoId of videoIds) {
    const duration = await getVimeoVideoDuration(videoId);
    results.push({ videoId, duration });
    // Add a small delay between requests
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // Output results in an easy to read format
  console.log('\nVideo Durations:');
  console.log('---------------');
  results.forEach(({ videoId, duration }) => {
    console.log(`${videoId}: ${duration} seconds`);
  });
}

// Example usage
const videoIds = [
  1042133772, // Add all your video IDs here
  1042137642,
  1042146017
];

getAllVideoDurations(videoIds);