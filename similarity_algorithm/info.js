const axios = require("axios");

// spotify response data
const callSpotifyAPI = (route, token) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`https://api.spotify.com/v1/${route}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        resolve(response.data);
      })
      .catch((err) => {
        console.error("Error:", err.message);
      });
  });
};

// top artists and songs
const getTopTracksAndArtists = (sp_dc) => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        "https://open.spotify.com/get_access_token?reason=transport&productType=web_player",
        {
          headers: {
            Cookie: `sp_dc=${sp_dc}`,
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36",
          },
        }
      )
      .then((res) => {
        const token = res.data.accessToken;
        const apiRoute = "me/top/tracks?limit=50";

        callSpotifyAPI(apiRoute, token)
          .then((responseData) => {
            const songNames = responseData.items.map((item) => item.id).sort();
            const artistNames = [
              ...new Set(
                responseData.items.flatMap((item) =>
                  item.artists.map((artist) => artist.id)
                )
              ),
            ].sort();
            const genres = [
              ...new Set(
                responseData.items.flatMap((item) =>
                  item.artists.flatMap((artist) => artist.genres)
                )
              ),
            ];
            resolve([songNames, artistNames, genres]);
          })
          .catch((err) => {
            console.error("Error:", err.message);
          });
      })
      .catch((err) => {
        console.error("Error:", err.message);
      });
  });
};

const sp_dc_one = process.env.KEY1;

const sp_dc_two = process.env.KEY2;

function calculateSimilarity(arr1, arr2) {
  const intersection = arr1.filter((value) => arr2.includes(value));
  //   const union = [...new Set([...arr1, ...arr2])];
  const similarity =
    (2 * intersection.length) /
    (arr1.length + arr2.length - intersection.length);
  return similarity;
}

getTopTracksAndArtists(sp_dc_one)
  .then(([songNamesOne, artistNamesOne, genresOne]) => {
    getTopTracksAndArtists(sp_dc_two)
      .then(([songNamesTwo, artistNamesTwo, genresTwo]) => {
        const songSimilarity = calculateSimilarity(songNamesOne, songNamesTwo);

        const artistSimilarity = calculateSimilarity(
          artistNamesOne,
          artistNamesTwo
        );

        const genreSimilarity = calculateSimilarity(genresOne, genresTwo);

        const totalCompatibility =
          0.5 * songSimilarity +
          0.25 * artistSimilarity +
          0.25 * genreSimilarity;

        console.log("Total Compatibility:", totalCompatibility * 100);
      })
      .catch((err) => {
        console.error("Error:", err.message);
      });
  })

  .catch((err) => {
    console.error("Error:", err.message);
  });
