













# Globetrotter

Globetrotter is an interactive geography quiz game that challenges players to identify cities around the world based on clues. Test your knowledge, improve your geography skills, and compete with friends!

## Features

### 🌍 Geography Quiz
- Guess cities from around the world based on descriptive clues
- Multiple-choice format with four possible answers
- Learn interesting facts about each location after answering

### 👤 User Accounts
- Create a personalized username to track your progress
- No complex registration required - just enter a username and start playing
- Your score is saved automatically as you play

### 📊 Score Tracking
- Track correct and incorrect answers
- See your performance statistics at a glance
- Persistent scoring across sessions

### 🎮 Interactive Gameplay
- Clean, intuitive user interface
- Immediate feedback on your answers
- Celebration animations for correct answers

### 🔄 Endless Play
- Continuous stream of new destinations to guess
- Never run out of challenges
- Gradually increase your geography knowledge

### 🔗 Social Sharing
- Challenge friends to beat your score
- Share your results on social media
- Generate custom score cards for sharing

## Project Structure

```
globetrotter/
├── public/                  # Static assets
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/             # API routes
│   │   │   ├── destinations/  # Destinations API
│   │   │   └── users/       # Users API
│   │   ├── layout.tsx       # Root layout
│   │   └── page.tsx         # Home page
│   ├── components/          # React components
│   │   ├── __tests__/       # Component tests
│   │   ├── Confetti.tsx     # Celebration animation
│   │   ├── GameBoard.tsx    # Main game interface
│   │   ├── ShareButton.tsx  # Social sharing functionality
│   │   └── UserRegistration.tsx # User registration form
│   ├── types/               # TypeScript type definitions
│   └── utils/               # Utility functions
│       ├── __tests__/       # Utility tests
│       ├── imageGenerator.ts # Image generation for sharing
│       └── mongodb.ts       # MongoDB connection utility
├── data.json                # Geography data
├── jest.config.ts           # Jest configuration
├── jest.setup.ts            # Jest setup
├── next.config.js           # Next.js configuration
├── package.json             # Project dependencies
├── tailwind.config.js       # Tailwind CSS configuration
└── tsconfig.json            # TypeScript configuration
```


## Technical Implementation

- **Frontend**: Next.js 14 with React 18, TypeScript, and Tailwind CSS
- **Backend**: Next.js API routes for server-side functionality
- **Database**: MongoDB for user data storage
- **State Management**: React hooks for local state management
- **Testing**: Jest and React Testing Library for unit and integration tests
- **Styling**: Tailwind CSS for responsive design

## API Documentation

### Users API

#### `POST /api/users`
Creates a new user or retrieves an existing one.

**Request Body:**
```json
{
  "username": "string"
}
```


**Response:**
```json
{
  "username": "string",
  "score": {
    "correct": 0,
    "incorrect": 0
  }
}
```


#### `GET /api/users?username=<username>`
Retrieves a user by username.

**Response:**
```json
{
  "username": "string",
  "score": {
    "correct": 0,
    "incorrect": 0
  }
}
```


#### `POST /api/users/update-score`
Updates a user's score.

**Request Body:**
```json
{
  "username": "string",
  "isCorrect": boolean
}
```


**Response:**
```json
{
  "username": "string",
  "score": {
    "correct": number,
    "incorrect": number
  }
}
```


### Destinations API

#### `GET /api/destinations`
Returns a random destination with multiple-choice options.

**Response:**
```json
{
  "destination": {
    "city": "string",
    "country": "string",
    "clues": ["string"],
    "fun_fact": ["string"]
  },
  "options": ["string"]
}
```


## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account (for database)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/globetrotter.git
cd globetrotter
```


2. Install dependencies:
```bash
npm install
# or
yarn install
```


3. Set up environment variables:
Create a `.env.local` file in the project root with:
```
MONGODB_URI=mongodb+srv://yourusername:yourpassword@yourcluster.mongodb.net/globetrotter?retryWrites=true&w=majority
```


4. Run the development server:
```bash
npm run dev
# or
yarn dev
```


5. Open [http://localhost:3000](http://localhost:3000) in your browser to start playing!

## Testing

Run the test suite with:
```bash
npm test
# or
yarn test
```


For test coverage:
```bash
npm test -- --coverage
```


## Deployment

The application can be deployed to Vercel with minimal configuration:

1. Push your code to a GitHub repository
2. Import the project in Vercel
3. Add your MongoDB URI as an environment variable in the Vercel dashboard
4. Deploy

## Database Setup

1. Create a MongoDB Atlas account at [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (the free tier is sufficient)
3. Create a database user with read/write permissions
4. Get your connection string from the "Connect" button
5. Replace the placeholder values in your connection string with your actual username and password

## Future Enhancements

- Difficulty levels (easy, medium, hard)
- Themed quizzes (capitals, landmarks, natural wonders)
- Leaderboards for competitive play
- More detailed statistics and achievements
- Map visualization of correctly guessed locations


Enjoy exploring the world with Globetrotter! 🌎
