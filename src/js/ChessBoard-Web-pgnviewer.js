/**
 * ChessBoard-Web-pgnviewer.js
 */
class ChessViewer {
  constructor(options) {
    this.containerId = options.containerId;
    this.pgn = options.pgn || '';
    this.boardWidth = options.boardWidth || 400;
    
    this.annotations = options.annotations || {};

    this.nagSymbolMap = {
      1: '!', 2: '?', 3: '!!', 4: '??', 5: '!?', 6: '?!', 7: '□',
      10: '=', 13: '∞', 14: '⩲', 15: '⩱', 16: '±', 17: '∓', 18: '+-', 19: '-+'
    };

    this.nagColorMap = {
      '!':  '#06adae',
      '!!': '#06adae',
      '?':  '#e69a29',
      '??': '#e74c3c',
      '!?': '#9b59b6',
      '?!': '#f7be42',
      '□':  '#0b0b0b'
    };

    this.boardConfig = Object.assign({
      position: 'start',
      draggable: false,
      showNotation: true,
      pieceTheme: 'img/chesspieces/wikipedia/{piece}.png'
    }, options.boardConfig || {});

    this.parsedTree = [];
    this.nodeMap = {};
    this.currentNodeId = null;
    this.board = null;

    this._injectStyles();
    this._buildUI();
    this._initChess();
    this._bindEvents();
  }

  _injectStyles() {
    if (document.getElementById('chess-viewer-styles')) return;

    const style = document.createElement('style');
    style.id = 'chess-viewer-styles';
    style.innerHTML = `
      /* total container */
      .cv-container {
        display: inline-flex;
        align-items: flex-start;
        gap: 20px;
        background: #1e1e1e;
        padding: 24px;
        border-radius: 12px;
        box-shadow: 0 12px 32px rgba(0, 0, 0, 0.45);
        color: #bababa;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        box-sizing: border-box;
      }

      /* chess board section */
      .cv-board-section {
        display: flex;
        flex-direction: column;
        gap: 16px;
        flex-shrink: 0;
        /* fixing CSS line height  */
        line-height: normal; 
      }

      /* control button styles */
      .cv-controls {
        display: flex;
        gap: 8px;
        background-color: #262522;
        padding: 6px;
        border-radius: 8px;
        box-sizing: border-box;
      }

      .cv-btn {
        flex: 1;
        height: 38px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: transparent;
        color: #989795;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      .cv-btn:hover { background-color: #363431; color: #ffffff; }
      .cv-btn:active { transform: scale(0.96); }
      .cv-btn svg { width: 18px; height: 18px; fill: currentColor; }

      /* notation(a1~h8) fixes */
      .notation-322f9 {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif !important;
        font-weight: 600 !important;
        font-size: 11px !important;
        cursor: default;
      }

      /* sidebar styles */
      .cv-sidebar {
        width: 320px;
        display: flex;
        flex-direction: column;
        background-color: #262522;
        border-radius: 8px;
        overflow: hidden;
        border: 1px solid rgba(255, 255, 255, 0.05);
        box-sizing: border-box;
      }

      .cv-header {
        padding: 12px 16px;
        background-color: #21201d;
        font-size: 12px;
        font-weight: 700;
        color: #8b8987;
        letter-spacing: 0.8px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        text-transform: uppercase;
        flex-shrink: 0;
      }

      .cv-moves-list {
        flex: 1;
        overflow-y: auto;
        overflow-x: hidden;
        display: flex;
        flex-direction: column;
      }

      /* scroll bar styles */
      .cv-moves-list::-webkit-scrollbar { width: 6px; }
      .cv-moves-list::-webkit-scrollbar-track { background: #262522; }
      .cv-moves-list::-webkit-scrollbar-thumb { background: #3d3b38; border-radius: 3px; }
      .cv-moves-list::-webkit-scrollbar-thumb:hover { background: #524f4b; }

      /* move list styles */
      .cv-move-row { display: flex; font-size: 14px; line-height: 34px; flex-shrink: 0; }
      .cv-move-row.even, .cv-move-row:nth-child(even) { background-color: rgba(0, 0, 0, 0.15); }

      .cv-move-num {
        width: 44px; text-align: center; color: #666564;
        background-color: rgba(0, 0, 0, 0.25); font-size: 12px;
        font-weight: 600; user-select: none; flex-shrink: 0;
      }

      .cv-move-cell {
        flex: 1; padding: 0 12px; cursor: pointer; color: #c3c2c0;
        border-radius: 4px; margin: 2px;
        transition: background-color 0.15s ease, color 0.15s ease;
        white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
      }
      .cv-move-cell.empty { cursor: default; }
      .cv-move-cell:not(.empty):hover { background-color: #363431; color: #ffffff; }

      .cv-move-cell.active, .cv-move-item.active {
        background-color: #3692e7 !important;
        color: #ffffff !important;
        font-weight: 600;
        box-shadow: 0 2px 6px rgba(54, 146, 231, 0.3);
      }

      .cv-nag { font-weight: bold; margin-left: 3px; }

      /* comment and variation styles */
      .cv-comment {
        background: #1a1917; border-left: 3px solid #f39c12;
        padding: 8px 12px; font-size: 13px; color: #d1d0ce;
        line-height: 1.5; box-sizing: border-box;
        word-break: break-word; white-space: pre-wrap;
      }

      .cv-inline-comment {
        display: inline-block; color: #999; font-style: italic;
        margin: 0 4px; word-break: break-word;
      }

      .cv-variation-block {
        padding: 8px 12px; background: rgba(0, 0, 0, 0.35);
        border-left: 2px solid #524f4b; box-sizing: border-box;
      }
      .cv-move-inline-wrap {
        display: inline-flex; flex-wrap: wrap; align-items: center;
        gap: 4px; font-size: 13px;
      }
      .cv-move-item {
        display: inline-flex; align-items: center; padding: 2px 6px;
        border-radius: 4px; cursor: pointer; color: #b0b0b0;
        background-color: rgba(255, 255, 255, 0.04); transition: all 0.15s;
      }
      .cv-move-item:hover { background-color: #363431; color: #fff; }
      .cv-move-number { color: #777; margin-right: 4px; font-weight: bold; }
      .cv-paren { color: #666; font-weight: bold; }
    `;
    document.head.appendChild(style);
  }

  _buildUI() {
    const $target = $(`#${this.containerId}`);
    $target.empty();

    const boardId = `${this.containerId}-board`;
    const movesId = `${this.containerId}-moves`;

    // setting height of sidebar to chessboard width + 50px to prevent layout issues
    const sidebarHeight = this.boardWidth + 50;

    $target.html(`
      <div class="cv-container">
        <div class="cv-board-section" style="width: ${this.boardWidth}px;">
          <!-- setting height and width of chessboard wrapper inline -->
          <div id="${boardId}" style="width: ${this.boardWidth}px; height: ${this.boardWidth}px;"></div>
          
          <div class="cv-controls">
            <button class="cv-btn btn-start" title="First Move">
              <svg viewBox="0 0 24 24"><path d="M18.4 16.6L12.8 12l5.6-4.6L17 6l-7 6 7 6zM6 6h2v12H6z"/></svg>
            </button>
            <button class="cv-btn btn-prev" title="Previous Move">
              <svg viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
            </button>
            <button class="cv-btn btn-next" title="Next Move">
              <svg viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
            </button>
            <button class="cv-btn btn-end" title="Last Move">
              <svg viewBox="0 0 24 24"><path d="M5.6 7.4L11.2 12 5.6 16.6 7 18l7-6-7-6zM16 6h2v12h-2z"/></svg>
            </button>
          </div>
        </div>
        
        <div class="cv-sidebar" style="height: ${sidebarHeight}px;">
          <div class="cv-header">Moves & Variations</div>
          <div class="cv-moves-list" id="${movesId}"></div>
        </div>
      </div>
    `);

    this.$boardEl = $(`#${boardId}`);
    this.$movesEl = $(`#${movesId}`);
    this.$container = $target.find('.cv-container');
  }

  _initChess() {
    this.board = Chessboard(this.$boardEl.attr('id'), this.boardConfig);
    this._parsePgnWithVariations(this.pgn);
    this._renderTreeUI();
    this.goToNode('root');

    // after DOM rendering resize event to perfectly align chessboard size
    setTimeout(() => {
      if (this.board && typeof this.board.resize === 'function') {
        this.board.resize();
      }
    }, 50);
  }

  // --- (under _parsePgnWithVariations, _getFormat, _renderTreeUI, _renderSublinesBlock, 
  //      _renderInlineSubTree, _bindEvents, goToNode, _applyAnnotations methods
  //      are unchanged and 100% identical) ---

  _parsePgnWithVariations(pgn) {
    const cleanPgn = pgn.replace(/\[\s*[\w\d]+\s+"[^"]*"\s*\]/g, '').trim();
    const tokens = [];
    let i = 0;

    while (i < cleanPgn.length) {
      const char = cleanPgn[i];
      if (char === '{') {
        let end = cleanPgn.indexOf('}', i);
        if (end === -1) end = cleanPgn.length;
        tokens.push({ type: 'comment', value: cleanPgn.substring(i + 1, end).trim() });
        i = end + 1;
      } else if (char === '(' || char === ')') {
        tokens.push({ type: 'paren', value: char });
        i++;
      } else if (/\s/.test(char)) {
        i++;
      } else {
        let start = i;
        while (i < cleanPgn.length && !/[\s{}()]/.test(cleanPgn[i])) { i++; }
        tokens.push({ type: 'token', value: cleanPgn.substring(start, i) });
      }
    }

    const root = { id: 'root', fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', children: [], parent: null };
    this.nodeMap = { root };
    let currentNode = root;
    const parentStack = [];
    let idCounter = 1;

    for (let t = 0; t < tokens.length; t++) {
      const tok = tokens[t];

      if (tok.type === 'comment') {
        const cleanComment = tok.value.replace(/\[%c[as]l\s+[^\]]+\]/gi, '').trim();
        if (cleanComment) currentNode.comment = (currentNode.comment ? currentNode.comment + ' ' : '') + cleanComment;
      } else if (tok.type === 'paren') {
        if (tok.value === '(') {
          parentStack.push(currentNode);
          if (currentNode.parent) currentNode = currentNode.parent;
        } else if (tok.value === ')') {
          if (parentStack.length > 0) currentNode = parentStack.pop();
        }
      } else if (tok.type === 'token') {
        const val = tok.value;
        if (val.match(/^\d+\./) || ['1-0', '0-1', '1/2-1/2', '*'].includes(val)) continue;

        let moveSan = val;
        let nag = '';

        const nagMatch = val.match(/\$(\d+)/);
        if (nagMatch) {
          nag = this.nagSymbolMap[parseInt(nagMatch[1], 10)] || `$${nagMatch[1]}`;
          moveSan = val.replace(/\$\d+/, '');
        }
        const symMatch = moveSan.match(/(!{1,2}|\?{1,2}|!\?|\?!|⩲|⩱|±|∓|\+-|-\+|=)/);
        if (symMatch) {
          nag = symMatch[0];
          moveSan = moveSan.replace(symMatch[0], '');
        }

        if (!moveSan) continue;

        const tempChess = new Chess(currentNode.fen);
        const moveRes = tempChess.move(moveSan, { sloppy: true });

        if (moveRes) {
          const nodeId = `node_${idCounter++}`;
          const moveNum = parseInt(currentNode.fen.split(' ')[5], 10);
          
          const newNode = {
            id: nodeId, san: moveRes.san, color: moveRes.color,
            moveNum: moveNum, nag: nag, fen: tempChess.fen(),
            children: [], parent: currentNode, moveIndex: idCounter - 1
          };
          currentNode.children.push(newNode);
          this.nodeMap[nodeId] = newNode;
          currentNode = newNode;
        }
      }
    }
    this.parsedTree = root.children;
  }

  _getFormat(node) {
    const ann = this.annotations[node.moveIndex];
    const defaultNagColor = this.nagColorMap[node.nag] || '';

    let textColor = '';
    let nagColor = defaultNagColor;
    let suffix = '';
    let suffixColor = '';

    if (defaultNagColor) textColor = defaultNagColor;

    if (ann && typeof ann === 'object') {
      if (ann.textColor) textColor = ann.textColor;
      if (ann.nagColor) nagColor = ann.nagColor;
      if (ann.suffix) suffix = ann.suffix;
      if (ann.suffixColor) suffixColor = ann.suffixColor;
    }

    return { color: textColor, nagColor: nagColor, suffix: suffix, suffixColor: suffixColor };
  }

  _renderTreeUI() {
    this.$movesEl.empty();
    if (!this.parsedTree.length) return;

    let curr = this.parsedTree[0];
    let $currentRow = null;
    let rowCount = 0;

    const createRow = (moveNum, isContinuation = false) => {
      rowCount++;
      const rowClass = rowCount % 2 === 0 ? 'even' : 'odd';
      const $row = $(`<div class="cv-move-row ${rowClass}"></div>`);
      $row.append(`<div class="cv-move-num">${isContinuation ? moveNum + '...' : moveNum}</div>`);
      return $row;
    };

    const formatSan = (node) => {
      const fmt = this._getFormat(node);
      const colorStyle = fmt.color ? `color: ${fmt.color};` : '';
      const nagStyle = fmt.nagColor ? `color: ${fmt.nagColor};` : '';
      const suffixHtml = fmt.suffix ? `<span style="margin-left:4px; font-weight:normal; color:${fmt.suffixColor || fmt.color || '#999'}">${fmt.suffix}</span>` : '';
      
      return `<span style="${colorStyle}">${node.san}</span>${node.nag ? `<span class="cv-nag" style="${nagStyle}">${node.nag}</span>` : ''}${suffixHtml}`;
    };

    while (curr) {
      if (curr.color === 'w') {
        $currentRow = createRow(curr.moveNum);
        $currentRow.append(`<div class="cv-move-cell" data-node-id="${curr.id}">${formatSan(curr)}</div>`);

        const hasComment = !!curr.comment;
        const hasVar = curr.parent && curr.parent.children.length > 1 && curr === curr.parent.children[0];

        if (hasComment || hasVar) {
          $currentRow.append(`<div class="cv-move-cell empty"></div>`);
          this.$movesEl.append($currentRow);
          $currentRow = null;

          if (hasComment) this.$movesEl.append(`<div class="cv-comment">${curr.comment}</div>`);
          if (hasVar) this._renderSublinesBlock(curr.parent, this.$movesEl);
        }
      } else {
        if (!$currentRow) {
          $currentRow = createRow(curr.moveNum, true);
          $currentRow.append(`<div class="cv-move-cell empty"></div>`);
        }
        $currentRow.append(`<div class="cv-move-cell" data-node-id="${curr.id}">${formatSan(curr)}</div>`);
        this.$movesEl.append($currentRow);
        $currentRow = null; 

        const hasComment = !!curr.comment;
        const hasVar = curr.parent && curr.parent.children.length > 1 && curr === curr.parent.children[0];

        if (hasComment) this.$movesEl.append(`<div class="cv-comment">${curr.comment}</div>`);
        if (hasVar) this._renderSublinesBlock(curr.parent, this.$movesEl);
      }
      curr = curr.children[0];
    }
    if ($currentRow) {
      $currentRow.append(`<div class="cv-move-cell empty"></div>`);
      this.$movesEl.append($currentRow);
    }
  }

  _renderSublinesBlock(parentNode, $container) {
    for (let i = 1; i < parentNode.children.length; i++) {
      const $varBlock = $('<div class="cv-variation-block"></div>');
      const $inlineWrap = $('<div class="cv-move-inline-wrap"></div>');
      this._renderInlineSubTree(parentNode.children[i], $inlineWrap);
      $varBlock.append($inlineWrap);
      $container.append($varBlock);
    }
  }

  _renderInlineSubTree(node, $container) {
    let curr = node;
    let forceNum = true;

    while (curr) {
      const needsNum = curr.color === 'w' || forceNum;
      const numStr = curr.color === 'w' ? `${curr.moveNum}.` : `${curr.moveNum}...`;

      const fmt = this._getFormat(curr);
      const colorStyle = fmt.color ? `style="color: ${fmt.color};"` : '';
      const nagStyle = fmt.nagColor ? `style="color: ${fmt.nagColor};"` : '';
      const suffixHtml = fmt.suffix ? `<span style="margin-left:4px; font-weight:normal; color:${fmt.suffixColor || fmt.color || '#999'}">${fmt.suffix}</span>` : '';

      const $item = $(`
        <div class="cv-move-item" data-node-id="${curr.id}">
          ${needsNum ? `<span class="cv-move-number">${numStr}</span>` : ''}
          <span ${colorStyle}>${curr.san}</span>
          ${curr.nag ? `<span class="cv-nag" ${nagStyle}>${curr.nag}</span>` : ''}
          ${suffixHtml}
        </div>
      `);
      
      $container.append($item);
      forceNum = false;

      if (curr.comment) {
        $container.append(`<div class="cv-inline-comment">${curr.comment}</div>`);
        forceNum = true;
      }

      if (curr.children.length > 1) {
        for (let i = 1; i < curr.children.length; i++) {
          $container.append('<span class="cv-paren">(</span>');
          this._renderInlineSubTree(curr.children[i], $container);
          $container.append('<span class="cv-paren">)</span>');
        }
        forceNum = true;
      }
      curr = curr.children[0];
    }
  }

  _bindEvents() {
    const self = this;
    this.$container.find('.btn-start').on('click', () => this.goToNode('root'));
    
    this.$container.find('.btn-prev').on('click', () => {
      if (this.currentNodeId && this.nodeMap[this.currentNodeId]?.parent) {
        this.goToNode(this.nodeMap[this.currentNodeId].parent.id);
      }
    });

    this.$container.find('.btn-next').on('click', () => {
      const curr = this.nodeMap[this.currentNodeId];
      if (curr && curr.children.length > 0) this.goToNode(curr.children[0].id);
    });

    this.$container.find('.btn-end').on('click', () => {
      let curr = this.nodeMap[this.currentNodeId] || this.nodeMap['root'];
      while (curr && curr.children.length > 0) curr = curr.children[0];
      if (curr) this.goToNode(curr.id);
    });

    this.$movesEl.on('click', '.cv-move-cell, .cv-move-item', function() {
      if ($(this).hasClass('empty')) return;
      const nodeId = $(this).data('node-id');
      if (nodeId) self.goToNode(nodeId);
    });
  }

  goToNode(nodeId) {
    const node = this.nodeMap[nodeId];
    if (!node) return;

    this.currentNodeId = nodeId;
    this.board.position(node.fen, true);

    this.$movesEl.find('.cv-move-cell, .cv-move-item').removeClass('active');
    
    if (nodeId !== 'root') {
      const $activeElement = this.$movesEl.find(`[data-node-id="${nodeId}"]`);
      $activeElement.addClass('active');

      if ($activeElement.length) {
        const elTop = $activeElement.offset().top - this.$movesEl.offset().top + this.$movesEl.scrollTop();
        const containerHeight = this.$movesEl.height();
        
        if (elTop < this.$movesEl.scrollTop() || elTop > this.$movesEl.scrollTop() + containerHeight - 40) {
          this.$movesEl.scrollTop(elTop - containerHeight / 3);
        }
      }
    }

    this._applyAnnotations(node);
  }

  _applyAnnotations(node) {
    if (typeof this.board.clearHighlights === 'function') this.board.clearHighlights();
    if (typeof this.board.clearShapes === 'function') this.board.clearShapes();
    if (typeof this.board.clearNagBadges === 'function') this.board.clearNagBadges();

    if (node.moveIndex) {
      const annotation = this.annotations[node.moveIndex];
      if (typeof annotation === 'function') {
        annotation(this.board, node);
      } else if (typeof annotation === 'object' && typeof annotation.fn === 'function') {
        annotation.fn(this.board, node);
      }
    }
  }
}