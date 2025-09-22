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
        /* デフォルト（ライト） */
        :root {
          --sidebar-color: #fff;
          --sidebar-color-standby: #fff9;
          --sidebar-backgroud-color: #484ca3;

          --main-color: #fff;
          --main-backgroud-color: #fafafa;
          --main-card-header-color: #393c7f;
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

        ul {
          padding-left: 0.5em;
          list-style: none;
        }

        li::before {
          content: '';
          display: inline-block;
          background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2aWV3Qm94PSIwIDAgNTEyIDUxMiI+PGcgZmlsbD0iY3VycmVudENvbG9yIj4gPHBhdGggZD0iTTQ5Ni4xNDUsMTEyLjkwOWMtOS43MzUtOS43NTgtMjMuMzk2LTE1Ljg1NS0zOC4yNzgtMTUuODQ2SDIxMi43NjFjLTMuMDExLDAtNS45MzEtMS4xNDctOC4xNS0zLjIzNSBsMC4wMTYsMC4wMjZsLTQzLjA3LTQwLjM5Yy0xMC4wNC05LjQwNS0yMy4yNzItMTQuNjQzLTM3LjAyNC0xNC42NDNoLTcwLjRjLTE0Ljg4Mi0wLjAwOC0yOC41NTIsNi4wOTYtMzguMjc4LDE1Ljg1NiBDNi4wOTYsNjQuNDAzLTAuMDA4LDc4LjA3MiwwLDkyLjk1NHYzMjYuMDkyYy0wLjAwOCwxNC44ODIsNi4wOTYsMjguNTUxLDE1Ljg1NSwzOC4yNzdjOS43MjYsOS43NTksMjMuMzk2LDE1Ljg2MywzOC4yNzgsMTUuODU2IGg0MDMuNzM0YzE0Ljg4MiwwLjAwOCwyOC41NTItNi4wOTYsMzguMjc4LTE1Ljg1NmM5Ljc1OS05LjcyNiwxNS44NjMtMjMuMzk1LDE1Ljg1NS0zOC4yNzdWMTUxLjE4NyBDNTEyLjAwOCwxMzYuMzA1LDUwNS45MDQsMTIyLjYzNiw0OTYuMTQ1LDExMi45MDl6IE00NjYuMjgyLDQyNy40NTJjLTIuMjI4LDIuMTk0LTUuMDY1LDMuNDgxLTguNDE0LDMuNDlINTQuMTMzIGMtMy4zNS0wLjAwOC02LjE4Ny0xLjI5Ni04LjQxNC0zLjQ5Yy0yLjE4Ni0yLjIxOS0zLjQ3My01LjA1Ny0zLjQ4MS04LjQwNlY5Mi45NTRjMC4wMDgtMy4zNSwxLjI5NS02LjE4NywzLjQ4MS04LjQxNSBjMi4yMjgtMi4xODYsNS4wNjUtMy40NzIsOC40MTQtMy40ODFoNzAuNGMzLjAyOCwwLDUuOTIzLDEuMTQ3LDguMTQyLDMuMjE4bDQzLjA2Miw0MC4zODFsMC4wMTYsMC4wMjUgYzEwLjAxNSw5LjM2MywyMy4yMzksMTQuNjE4LDM3LjAwNywxNC42MThoMjQ1LjEwNmMzLjM1LDAuMDA4LDYuMTk2LDEuMjk1LDguNDE0LDMuNDgxYzIuMTg2LDIuMjE5LDMuNDc0LDUuMDU3LDMuNDgxLDguNDA2IHYyNjcuODU5QzQ2OS43NTYsNDIyLjM5NSw0NjguNDY4LDQyNS4yMzMsNDY2LjI4Miw0MjcuNDUyeiI+PC9wYXRoPjwvZz48L3N2Zz4=");
            no-repeat center;
          width: 1em;
          height: 1em;
          background-size: contain;
          margin-right: 0.5em;
        }

        ul a,
        a:visited,
        a:hover,
        a:active {
          color: var(--sidebar-color-standby);
          text-decoration: none;
        }

        ul a:hover {
          color: var(--sidebar-color);
          text-decoration: underline;
        }

        .container {
          display: flex;
          height: 100vh;
        }

        .sidebar-content {
          height: 100%;
          width: 200px;
          color: var(--sidebar-color);
          background-color: var(--sidebar-backgroud-color);
          padding: 1rem;
          box-sizing: border-box;
          border-right: 1px solid #ccc;
          overflow: auto;
        }

        .main-content {
          background-color: var(--main-backgroud-color);
          flex: 1; /* 残りの幅を埋める */
          padding: 1rem;
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
        <nav class="sidebar-content">${sidebarListElement}</nav>
        <main class="main-content">${gallery}</main>
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
