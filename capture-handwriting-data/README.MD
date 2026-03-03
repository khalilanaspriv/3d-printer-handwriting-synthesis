# Capture Handwriting Data

## Tech Stack
I've decided to use vanilla HTML, CSS, JS, since this project doesn't require a backend and runs locally.

## Project File Structure
The project file structure is designed to be modular and efficient, by putting the files in separate folders. You can change the sentences you need for sampling in the sentences.json file located in the data folder.

```
D:.
│   capture.html
│   README.MD
│   
├───assets
│       sentences.json
│       
├───css
│   │   wrapper.css
│   │
│   ├───base
│   │       override.css
│   │       reset.css
│   │       variables.css
│   │
│   └───modules
│           capture.css
│
└───js
    ├───base
    │       .gitkeep
    │
    └───modules
            capture.js
```

## Thought Process
### Project Setup:
* I started by defining a modular file structure and setting up a GitHub repository. This allows me to track changes and keep the codebase organized as I move between different components like capture logic and UI styling.
### Canvas Engine:
* I built the drawing system using the HTML5 Canvas API. I focused on the `PointerEvents` interface to distinguish between stylus, touch, and mouse input, ensuring that only high-precision pen data is used for the dataset.
### Data Representation:
* Instead of saving raw pixel positions, I implemented a delta-encoding system. By storing the difference ($dx$, $dy$) between points, the data becomes scale-invariant, which is a standard requirement for training handwriting synthesis models.
### Externalized Dataset:
* To keep the app lightweight and flexible, I moved the 81 pangram sentences into an external JSON file. This allows me to swap out the training text easily without modifying the core JavaScript capture logic.

## Issues Encountered
* Coordinate Offset: Moving the UI controls to a header caused the ink to appear below the stylus tip. I fixed this by using `getBoundingClientRect()` to calculate the pen position relative to the canvas rather than the whole screen.
* Palm Interference: Recording with standard touch events picked up "ghost" lines from my palm resting on the screen. I restricted input to `pointerType === 'pen'` so the app ignores everything except the stylus.
* Data Scaling: Absolute $x, y$ coordinates vary too much between devices. I switched the data format to Delta Encoding ($dx, dy$) to record the movement between points, making the data much more consistent for AI training.
* Canvas Blurriness: High-resolution mobile screens made the drawing look fuzzy. I scaled the drawing buffer using `window.devicePixelRatio` so the strokes stay crisp and the math remains accurate.
* Hardcoded Content: Storing all 81 sentences inside the logic script was messy and hard to manage. I moved them into a separate JSON file and used an `async fetch` to load them dynamically.
* Baseline Consistency: Writing on a blank screen led to slanted or inconsistent letter sizes. I added a notebook-style background pattern with horizontal lines using CSS `linear-gradient` to give a visual guide while writing.

## Future Enhancements and Fixes
* [ ] Optimize screen space usage.
* [ ] Enhance Data Sanitization. (Get clean data right away.)

## AI Use
I used AI as a technical peer to help with repetitive tasks such as troubleshooting Git CLI commands (I'm still learning how to use Git). This allowed me to stay focused on the important part of the project while still learning the best practices for professional documentation and version control. I also brainstormed ideas during the building process to explore the most efficient solutions to my technical problems.

## License
Distributed under the MIT License. Click the license tab for more information.