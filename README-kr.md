# ♟ChessBoard-Web.js♟
![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)
![jQuery](https://img.shields.io/badge/jQuery-v3.4.1%2B-orange.svg)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-yellow.svg)

[🇺🇸 English](https://github.com/hyeongi-park/ChessBoard-Web.js/blob/main/README.md)  |  [🇰🇷 한국어](https://github.com/hyeongi-park/ChessBoard-Web.js/blob/main/README-kr.md)


**ChessBoard-Web.js**는 현대적인 체스 웹 애플리케이션 구축을 위해 확장된 순수 자바스크립트 체스판 컴포넌트입니다.  
기존 [chessboard.js](https://github.com/oakmac/chessboardjs)의 경량성과 유연함을 유지하면서, **Chess.com 스타일의 NAGs(수 분석 배지) 시스템, 오버레이 레이어링 최적화, 커스텀 테마 보정** 등 현대 체스 UI에 필수적인 핵심 기능들을 대폭 강화했습니다.

jQuery v3.4.1 (혹은 그 이상) 버전에 의존합니다.


---

## 🚀 ChessBoard-Web.js가 뭔가요?

ChessBoard-Web.js는 [chessboard.js](https://github.com/oakmac/chessboardjs)라는 레포지토리의 코드에서 시각적 내용을 중점으로 다양한 기능을 추가한 웹 브라우저에서 실행되는 독립형 체스판 라이브러리입니다. 체스판의 인터랙션과 시각적 표현에 집중하도록 설계되어, 백엔드 엔진이나 체스 로직 라이브러리([chess.js](https://github.com/jhlywa/chess.js)), 체스 엔진 API([stockfish](https://github.com/official-stockfish/Stockfish))등과 자유롭게 연동할 수 있습니다. 

다음은 **ChessBoard-Web.js**로 구현할 수 있는 주요 예시입니다:

- **체스 기보 시각화**: PGN 데이터베이스와 연동하여 대국을 리플레이하고 수의 흐름을 직관적으로 연출합니다.
- **체스 퍼즐 & 전술 연습**: 사용자가 최적의 수를 예측하고 전술을 풀어가는 전략 웹사이트를 구축합니다.
- **실시간 분석 보드**: 엔진 추천 수와 착수 평가(Brilliant, Blunder, Great Move 등)를 보드 위에 실시간으로 표시합니다.
- **변형 체스 및 대진 플랫폼**: 변형 체스(Variants) 규칙이나 실시간 멀티플레이어 체스 게임 사이트의 프론트엔드로 활용합니다.
- **체스 강좌/블로그**: 체스 강좌 사이트나 개인 체스 기록 블로그 등을 만들 때 굉장히 유용하게 사용할 수 있습니다.

ChessBoard-Web.js는 이러한 복잡한 요구사항들을 최소한의 코드와 뛰어난 확장성으로 깔끔하게 처리합니다.


---

## ✨ 기존 chessboard.js와의 차이점은 무엇인가요?
기존 [chessboard.js](https://github.com/oakmac/chessboard.js)는 단순하고 가벼운 보드 표현에는 뛰어났지만, **Chess.com**이나 **Lichess**와 같은 최신 체스 플랫폼의 풍부한 시각 분석 기능(ex. 화살표 기능, PGN 뷰어, 셀 선택 기능, NAGs 배지 등)들이 구현되어 있지 않아 부족하다고 느껴질 수 있었습니다. 이후 [chessboard2](https://github.com/oakmac/chessboard2)의 경우 이러한 문제들을 어느정도 해결하기는 했으나,  typescript 코드 여러 개로 나뉘어져 있고 [공식 사이트](https://chessboardjs.com/)에서 다운로드가 안 되는 등 2023년 이후로 개발이 사실상 멈추어서 하나의 통합된 시각적으로 좋은 코드가 필요하다고 느꼈습니다. **ChessBoard-Web.js**는 이러한 한계를 해결하고 차별화된 기능들을 제공합니다.

### 1. 📝 Jekyll 및 정적 블로그 완벽 호환
* **Jekyll, Hugo, GitHub Pages** 같은 마크다운 기반 정적 블로그 포스트 안에 스크립트와 컨테이너 태그 몇 줄만 추가하면, 빌드 과정의 복잡함 없이 **인터랙티브한 체스 분석 보드와 기보 뷰어가 블로그 본문 안에 즉시 렌더링**됩니다.
* 체스 관련 기술 블로그나 리뷰 글을 작성할 때 독자에게 생생한 대국 화면을 보여주기에 최적화되어 있습니다.

### 2. 🔝 PGN viewer 지원
* 기존 fen만 지원되는 chessboard.js에서 확장하여 PGN도 인식을 하고, PGN 뷰어를 통해 수순을 옆에 나열해 쉽게 볼 수 있도록 코드를 분할하여 추가했습니다.
* PGN에 있는 각주들, 세부 라인들까지 전부 지원하여 Lichess study나 Chess.com collection의 내용을 그대로 옮겨 올 수 있습니다.

### 3. ‼️ Move Annotation Badges 시스템 내장
* 착수한 칸 위에 **Brilliant(`!!`)**, **Great(`!`)**, **Blunder(`??`)**, **Book Move(`📖`)** 등 수의 정밀 분석 아이콘을 단 한 줄의 코드만으로 쉽게 표시할 수 있습니다.
* `board.addNagBadge('e4', 'mistake')`처럼 직관적인 메서드를 제공하여 이를 통해 원하는 수순의 원하는 자리에 추가할 수 있습니다.
* NAGs 테마를 선택할 수 있는 옵션(`nagTheme`)을 제공하여 사용자가 원하는 커스텀 아이콘들을 유연하게 변경 가능합니다.


### 4. 🎯 화살표, 마크 기능 지원
* Chess.com, Lichess에서와 같이 우클릭으로 칸 선택, 화살표 기능을 지원하여 마우스 우클릭으로 쉽게 기물 움직임 시각화가 가능하게 합니다.
* 칸을 원, 네모, 엑스 등의 다양한 모양으로 마킹할 수 있으며 화살표와 함께 크기, 투명도, 색깔, 형태 등 다양한 옵션들로 커스터마이징이 가능합니다.
* 마지막 착수 위치, 선택된 칸, 공격받는 위치를 강조하는 고성능 하이라이팅 및 연출 레이어가 내장되어 있어 복잡한 CSS 조작 없이도 세련된 웹 인터페이스를 완성할 수 있습니다.

---



## 📦 빠른 시작

### 1. 파일 다운로드
최상단에 위치한 code.zip 파일을 다운로드 해주시고, 압축을 풀어주세요. 파일 구조를 원하는 형태로 바꾸고 싶다면 `<script src=>`와 `<link rel=>` 항목만 수정해 주면 됩니다.


### 2. HTML 컨테이너 생성

```html
// jQuery는 필수적으로 의존하므로 cdn을 통해 불러와야 합니다
<script src="[https://code.jquery.com/jquery-3.6.0.min.js](https://code.jquery.com/jquery-3.6.0.min.js)"></script>
<link rel="stylesheet" href="css/ChessBoard-Web.css">
<script src="js/ChessBoard-Web.js"></script>

<div id="myBoard" style="width: 400px; margin: auto;"></div>
```

### 3. 보드 생성
```JavaScript
var board = Chessboard('myBoard', {
  position: 'start', // 시작 포지션
  draggable: true
});
board.addNagBadge('e4', 'brilliant'); // e4 칸에 탁월한 수(Brilliant) 추가
board.addMark('c5', 'circle', { color: 'red', size: 20, strokeWidth: 3 }) // c5 칸에 동그라미 마크 추가
```


---


## 🛠️ 추가 기능 및 활용
추가적인 활용을 더 알고 싶다면 [chessboard.js의 공식 사이트 문서](https://chessboardjs.com/docs)를 먼저 읽어보세요. ChessBoard-Web.js는 chessboard.js와 완전히 호환되며 추가적인 기능이 덧붙여진 형태이므로 [chessboard.js의 예시](https://chessboardjs.com/examples#1000) 또한 똑같이 잘 작동합니다. ChessBoard-Web.js만의 추가적인 기능과 그 예시를 더 알고싶다면 [**Wiki**](https://github.com/bigegg3000-huang/chessboardweb.js/wiki)를 참고하실 수 있습니다.



---


## 📄 라이선스 (License)
본 프로젝트는 MIT License를 따릅니다. 오픈소스 및 상업적 용도 모두 자유롭게 수정 및 재배포가 가능합니다. 기여를 원한다면 [COTRIBUTING.md](https://github.com/hyeongi-park/ChessBoard-Web.js/blob/main/CONTRIBUTING.md)를 참고해주세요.
