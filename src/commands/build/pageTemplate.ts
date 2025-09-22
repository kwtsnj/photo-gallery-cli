import { html } from './htmlHelper.js';
import { imageContainerScript } from './components/image-container.js';
import {
  LAZY_IMAGE_CLICK_EVENT_NAME,
  lazyImageScript,
} from './components/lazy-image.js';

// language=html
export const pageTemplate = (
  gallery: string,
  sidebarListElement: string | null,
) => html`
  <!DOCTYPE html>
  <html lang="ja">
    <head>
      <meta charset="UTF-8" />
      <title>Photo Gallery</title>
      <style>
        html {
          /* アンカー移動をスムーズに */
          scroll-behavior: smooth;
        }

        body {
          margin: 0;
          background-image:
            linear-gradient(#444cf7 1px, transparent 1px),
            linear-gradient(to right, #444cf7 1px, #e5e5f7 1px);
          background-size: 20px 20px;
        }

        body::before {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background-color: #e5e5f7;
          opacity: 0.8;
          z-index: -1;
        }

        ul {
          padding-left: 0.5em;
        }

        .container {
          display: flex;
          height: 100vh;
        }

        .sidebar {
          width: 200px; /* 左メニュー幅 */
          background: #f0f0f0;
          padding: 1rem;
          box-sizing: border-box;
          border-right: 1px solid #ccc;
        }

        .main-content {
          flex: 1; /* 残りの幅を埋める */
          padding: 1rem;
          overflow-y: auto; /* 縦スクロール可能 */
          box-sizing: border-box;
        }

        .overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.8);
          display: none;
          align-items: center;
          justify-content: center;
        }

        .overlay.active {
          display: flex;
        }

        .overlay img {
          max-width: 90%;
          max-height: 90%;
          border-radius: 4px;
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
        }
      </style>
    </head>
    <body>
      <!-- モーダル -->
      <div id="overlay" class="overlay">
        <img src="" alt="" />
      </div>
      <div class="container">
        <!-- 左側：リンク集 -->
        <nav class="sidebar">${sidebarListElement}</nav>
        <main class="main-content">
          <h2 id="section1">セクション1</h2>
          <p>ここはセクション1の内容です。スクロールできます。</p>

          <h2 id="section2">セクション2</h2>
          <p>ここはセクション2の内容です。</p>

          <h2 id="section3">セクション3</h2>
          <p>ここはセクション3の内容です。</p>
          ${gallery}
        </main>
      </div>
      ${imageContainerScript} ${lazyImageScript}
      <script>
        const overlay = document.getElementById('overlay');
        const overlayImg = overlay.querySelector('img');

        window.addEventListener('load', () => {
          this.addEventListener('${LAZY_IMAGE_CLICK_EVENT_NAME}', (evt) => {
            const imgSrc = evt?.detail?.src;
            if (imgSrc) {
              overlayImg.src = imgSrc;
              overlay.classList.add('active');
            }
          });
        });

        overlay.addEventListener('click', () => {
          overlay.classList.remove('active');
        });
      </script>
    </body>
  </html>
`;
