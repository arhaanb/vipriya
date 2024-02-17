# Vipriya

> A dating app that matches you based on your music preferences. [Please view our demo video here](https://www.youtube.com/watch?v=81eX0Jx9L6Q).

### [View Demo Video Here](https://www.youtube.com/watch?v=81eX0Jx9L6Q)

## Introduction

Vipriya stands out in the dating app scene with its unique approach to matchmaking, leveraging Spotify music API. Vipriya's algorithm, inspired by the Sørensen–Dice coefficient, goes beyond conventional matching, considering both shared interests and diverse personalities for enhanced compatibility. With a focus on personal growth and exploration, Vipriya encourages users to learn and discover new genres together. Vipriya, where uniqueness meets compatibility, redefines the dating experience by bringing people together through the magic of music and diversity.

Vipriya is a cross platform mobile app.

![workflow](https://github.com/arhaanb/vipriya/assets/49993666/8a2287f1-aff1-4b8a-85ba-64cdda5a8533)

## Features

### 1. Spotify Integration

- Connect your Spotify account to Vipriya for a personalized music analysis.
- Discover matches based on shared musical tastes and explore new songs together.

### 2. Personality Matching

- Our algorithm inspired by Sørensen–Dice coefficient considers both shared interests and complementary traits for enhanced compatibility.

### 3. User Profiles

- Create a profile showcasing your personality.
- Browse profiles of potential matches and find someone who resonates with you.

### 4. Profanity filter

- Our app censors any bad or malicious words used using a profanity checker API. The words are replaced with asterisks to make this a safe and fun platform.

## Website

Check out our website at [arhn.us/vipriya](https://arhn.us/vipriya).


## Algorithm Used 
We extract the most-listened-to tracks, artists, and genres of each user who has signed up for the app. Then, using this data, we calculate the Sørensen-Dice Coefficient formula between each possible valid couple in our user database and apply the appropriate bias between tracks, artists, and genres. The Sørensen-Dice Coefficient measures the similarity and diversity of sample sets. It can be seen as the percentage of overlap between two sets, which is a value between 0 and 1, representing how similar the music taste of two individuals is. 

<center>
<div style="display: flex; justify-content: space-between;">
  <img src="https://i.imgur.com/eAyQuXm.png" alt="Diagram" width="300" height="300">
</div>
</center>


## API Overview

### 1. Spotify API 
Our algorithm leverages the Spotify API for requesting top the following
- top songs
- top artists
- calculating genres from the above

### 2. Profanity Filter API
The app uses the profanity filter to prevent any unwanted malicious words from being used in people's dating profiles (for example, their bio). The API returns the string to mark the word with asterisks.

## How To Use

### Mobile App
1. Clone the repository
2. Install the dependencies using `yarn install` or  `npm i`
3. Download the Expo Go app on your phone
4. Create a development build for the app (https://docs.expo.dev/develop/development-builds/create-a-build/)
5. This should install the app. The app should install on your phone.
6. Run the client using `yarn start`

### Backend API
1. Run a MongoDB instance.
2. Add the `MONGO_URI` to the `.env` file.
3. Install dependencies using `npm i`
4. Run the program using `yarn dev`.
5. The backend API link and port will have to be run on your local network using your IP. This has been hardcoded for the purpose of this hackathon. Your device may have a different one and require additional setup to run the mobile app.

**Note: Both the backend API and mobile app will have to be run together.** 
Contact [Arhaan Bahadur](https://arhaanb.com) for any more details.

## Team Details
- Team Name: **H1-218**
- Members: **Arhaan Bahadur, Ishir Bhardwaj, Manit Kaushik, Prabal Minotra**

### `env` file
- backend
```
MONGO_URI=mongodb+srv://duckfuck:duckfuck420@cluster0.hubszf1.mongodb.net/
```
