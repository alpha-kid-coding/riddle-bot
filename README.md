# Riddle Bot

A browser-based riddle game with clues, scoring, timed modes, typo/synonym-friendly answers, and saved reviews/times.

## Features

- 16 riddles per round
- Two clues per riddle
- Flexible answer matching:
  - case-insensitive
  - ignores punctuation/spaces/articles
  - fuzzy typo tolerance
  - synonym matching for common answers
- Scoring system with try/clue rules
- 5-minute double-points mode
- Countdown before timed rounds (`3, 2, 1, GO!`)
- Saved reviews and times
- Reviews/Times viewer in-app
- Virtual keyboard toggle

## Game Modes

- **Start Game**: standard timed round with normal points
- **5 Min Double Points**: 5-minute countdown; correct answers are worth double points

## Scoring

### Normal mode
- Try 1: `1` point
- Tries 2–5: `0.5` points
- Try 6+: `0.25` points
- If at least one clue is shown, max is `0.5` (unless try 6+, then `0.25`)

### 5 Min Double Points mode
- Try 1: `2` points
- Tries 2–5: `1` point
- Try 6+: `0.5` points
- If at least one clue is shown, max is `1`

## Controls

- **Space**: progress flow (start, clues, reveal, next)
- **Enter**:
  - submit answer (in input)
  - go to next riddle after answer is shown
  - continue end-game/review flow
- **Arrow Left**: previous riddle
- Buttons:
  - Give Up
  - Give a Clue
  - Previous / Next
  - End Game
  - Reviews / Times
  - Keyboard
  - Start Over

## Project Structure

- `index.html` - app layout
- `styles.css` - UI styling
- `app.js` - game logic and interactions
- `riddles.js` - riddle sets/content
- `server.py` - local API for saving/retrieving reviews and times
- `riddlebotrivews` - file-backed saved review entries
- `riddlebottimes` - file-backed saved time entries

## Run Locally

From the project root:

```bash
python3 server.py
```

Then open:

`http://127.0.0.1:8767`

## Data Persistence

- Browser storage:
  - `localStorage` key `riddleBotReviews`
  - `localStorage` key `riddleBotTimes`
- File storage through local API:
  - reviews appended to `riddlebotrivews`
  - times appended to `riddlebottimes`

## Notes

- This project is designed for local play.
- Hard refresh after updates if needed: `Cmd + Shift + R`.
