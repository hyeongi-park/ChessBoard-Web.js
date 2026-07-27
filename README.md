# ♟ChessBoard-Web.js♟
![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)
![jQuery](https://img.shields.io/badge/jQuery-v3.4.1%2B-orange.svg)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-yellow.svg)

[🇺🇸 English](https://github.com/hyeongi-park/ChessBoard-Web.js/blob/main/README.md)  |  [🇰🇷 한국어](https://github.com/hyeongi-park/ChessBoard-Web.js/blob/main/README-kr.md)

**ChessBoard-Web.js** is an extended, pure JavaScript chessboard component built for modern web chess applications.  
While retaining the lightweight nature and flexibility of the original [chessboard.js](https://github.com/oakmac/chessboardjs), it heavily enhances essential modern chess UI features such as a **Chess.com-style NAGs (Move Annotation Badges) system, overlay layering optimization, and custom theme overrides**. Please refer to the **[Wiki](https://github.com/hyeongi-park/ChessBoard-Web.js/wiki)** for usage instructions.

It depends on jQuery v3.4.1 (or higher).

---

## 🚀 What is ChessBoard-Web.js?

ChessBoard-Web.js is a standalone chessboard library running in the web browser, built by taking code from the [chessboard.js](https://github.com/oakmac/chessboardjs) repository and adding various features with a primary focus on visual enhancement. Designed to focus heavily on board interaction and visual representation, it can be freely integrated with backend engines or chess logic libraries like [chess.js](https://github.com/jhlywa/chess.js), and chess engine APIs like [stockfish](https://github.com/official-stockfish/Stockfish).

Here are some primary use cases you can build with **ChessBoard-Web.js**:

- **Chess PGN Visualization**: Replay games and intuitively render the flow of moves by integrating with PGN databases.
- **Chess Puzzles & Tactical Training**: Build strategy websites where users can predict the best moves and solve tactical problems.
- **Live Analysis Boards**: Display engine recommendations and move evaluations (Brilliant, Blunder, Great Move, etc.) directly on the board in real-time.
- **Chess Variants & Match Platforms**: Use it as a frontend for chess variants or real-time multiplayer chess gaming sites.
- **Chess Tutorials & Blogs**: Extremely useful when creating chess lecture websites or personal chess journaling blogs.

ChessBoard-Web.js handles these complex requirements cleanly with minimal code and exceptional extensibility.

---

## ✨ How does it differ from the original chessboard.js?
While the original [chessboard.js](https://github.com/oakmac/chessboard.js) excelled at simple and lightweight board rendering, it lacked rich visual analysis features found on modern chess platforms like **Chess.com** or **Lichess** (e.g., arrow drawing, PGN viewers, square selection, NAGs badges). Although [chessboard2](https://github.com/oakmac/chessboard2) partially addressed some of these issues, it was split across multiple TypeScript files and is no longer downloadable from its [official site](https://chessboardjs.com/), with development effectively stalling after 2023. We felt the need for a unified, visually polished codebase. **ChessBoard-Web.js** solves these limitations and offers distinct advantages:

### 1. 📝 Seamless Compatibility with Jekyll and Static Blogs
* By adding just a few lines of scripts and container tags into markdown-based static blog posts (such as **Jekyll, Hugo, GitHub Pages**), **interactive chess analysis boards and PGN viewers render instantly** inside your blog body without complex build processes.
* Optimized for presenting vivid game boards to readers when writing chess-related tech blogs or review articles.

### 2. 🔝 PGN Viewer Support
* Expanding beyond the original chessboard.js which only supported FEN, it parses PGN data and integrates a PGN viewer module to display the sequence of moves neatly alongside the board.
* Full support for comments and sub-variations embedded within PGNs, allowing you to seamlessly import content from Lichess studies or Chess.com collections.

### 3. ‼️ Built-in Move Annotation Badges System
* Easily display precision analysis icons—such as **Brilliant (`!!`)**, **Great (`!`)**, **Blunder (`??`)**, or **Book Move (`📖`)**—directly on top of squares with a single line of code.
* Provides intuitive methods like `board.addNagBadge('e4', 'mistake')` to add badges to any desired move and square.
* Provides a `nagTheme` option to customize and switch icon themes based on your preferences.

### 4. 🎯 Arrow and Mark Features
* Support for selecting squares and drawing arrows via right-click, just like Chess.com and Lichess, allowing easy visualization of piece movements.
* Mark squares with various shapes like circles, rectangles, or crosses, and customize arrows and shapes using options such as size, opacity, color, and form.
* High-performance highlighting and rendering layers are embedded to emphasize the last move, selected squares, and attacked squares, achieving a sophisticated web interface without complex CSS manipulation.

---

## 📦 Quick Start

### 1. Download Files
Download the `code.zip` file located at the top of the repository and extract it. If you want to change the file structure to your liking, you only need to modify the `<script src=>` and `<link rel=>` paths.


### 2. Create an HTML Container
```html
<!-- jQuery is a mandatory dependency, load it via CDN -->
<script src="[https://code.jquery.com/jquery-3.6.0.min.js](https://code.jquery.com/jquery-3.6.0.min.js)"></script>
<link rel="stylesheet" href="css/ChessBoard-Web.css">
<script src="js/ChessBoard-Web.js"></script>

<div id="myBoard" style="width: 400px; margin: auto;"></div>
```

### 3. Initialize the Board
```JavaScript
var board = Chessboard('myBoard', {
  position: 'start', // Starting position
  draggable: true
});
board.addNagBadge('e4', 'brilliant'); // Add a Brilliant badge to e4
board.addMark('c5', 'circle', { color: 'red', size: 20, strokeWidth: 3 }); // Add a red circle mark to c5
```

---


## 🛠️ Additional Features & Usage

To explore further functionalities, read [the official chessboard.js documentation](https://chessboardjs.com/docs) first. Since ChessBoard-Web.js is fully compatible with chessboard.js with extra features layered on top, [the chessboard.js examples](https://chessboardjs.com/examples#1000) will work identically. To learn more about ChessBoard-Web.js-specific features and examples, you can check the **[Wiki](https://github.com/hyeongi-park/ChessBoard-Web.js/wiki)**.


---


## 📄 License
This project is licensed under the MIT License. It is freely modifiable and redistributable for both open-source and commercial use. If you wish to contribute, please refer to [CONTRIBUTING.md](https://github.com/hyeongi-park/ChessBoard-Web.js/blob/main/CONTRIBUTING.md).
