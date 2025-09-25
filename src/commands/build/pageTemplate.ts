import { html } from './htmlHelper.js';
import { imageContainerScript } from './components/image-container.js';
import {
  LAZY_IMAGE_CLICK_EVENT_NAME,
  lazyImageScript,
} from './components/lazy-image.js';
import { SIDEBAR_TREE_CLASS_NAME } from './buildCommandHandler';

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
        /* デフォルト（ライト） */
        :root {
          --sidebar-color-primary: #fff;
          --sidebar-color-secondary: #fff9;
          --sidebar-backgroud-color-primary: #484ca3;

          --main-color-primary: #fff;
          --main-backgroud-color-primary: #fafafa;
          --main-card-header-color-primary: #393c7f;
        }

        /* TODO: ダークテーマ */
        :root[data-theme='dark'] {
          --sidebar-backgroud-color: #fff;
        }

        html {
          /* アンカー移動をスムーズに */
          scroll-behavior: smooth;
        }

        body {
          margin: 0;
        }

        h1,
        h2,
        h3,
        h4,
        h5,
        h6 {
          margin: 0;
          padding: 0;
        }

        ul.${SIDEBAR_TREE_CLASS_NAME},
        ul.${SIDEBAR_TREE_CLASS_NAME} ul {
          padding-left: 1em;
          list-style: none;
        }

        ul.${SIDEBAR_TREE_CLASS_NAME} svg {
          width: 0.8em;
          height: 0.8em;
        }

        ul.${SIDEBAR_TREE_CLASS_NAME} span {
          color: var(--sidebar-color-secondary);
          white-space: nowrap;
        }

        ul.${SIDEBAR_TREE_CLASS_NAME} a,
        ul.${SIDEBAR_TREE_CLASS_NAME} a:visited,
        ul.${SIDEBAR_TREE_CLASS_NAME} a:hover,
        ul.${SIDEBAR_TREE_CLASS_NAME} a:active {
          color: var(--sidebar-color-primary);
          text-decoration: none;
          white-space: nowrap;
        }

        ul.${SIDEBAR_TREE_CLASS_NAME} a:hover {
          text-decoration: underline;
        }

        .container {
          display: flex;
          height: 100vh;
        }

        .sidebar-content {
          height: 100%;
          width: 20em;
          color: var(--sidebar-color-primary);
          background-color: var(--sidebar-backgroud-color-primary);
          padding: 0.5em 1em;
          box-sizing: border-box;
          border-right: 1px solid #ccc;
          overflow: auto;
        }

        .main-content {
          background-color: var(--main-backgroud-color-primary);
          flex: 1; /* 残りの幅を埋める */
          padding: 1em;
          overflow-y: auto; /* 縦スクロール可能 */
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          gap: 1em;
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
          z-index: 9999;
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
        <nav class="sidebar-content">
          <h3>フォルダ</h3>
          ${sidebarListElement}
        </nav>
        <main class="main-content">${gallery}</main>
      </div>
      ${imageContainerScript} ${lazyImageScript}
      <script>
        const overlay = document.getElementById('overlay');
        const overlayImg = overlay.querySelector('img');

        document.addEventListener('keydown', (e) => {
          switch (e.key) {
            case 'Escape':
              console.log('ESCキーが押されました');
              overlay.classList.remove('active');
              break;
            case 'ArrowRight':
              console.log('右キーが押されました');
              break;
            case 'ArrowLeft':
              console.log('左キーが押されました');
              break;
            default:
              // それ以外のキーは無視
              break;
          }
        });

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
