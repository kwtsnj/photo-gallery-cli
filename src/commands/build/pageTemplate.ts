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
        }

        ul {
          padding-left: 0.5em;
          list-style: none;
        }

        li::before {
          content: '';
          display: inline-block;
          background: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2aWV3Qm94PSIwIDAgNTEyIDUxMiI+PGc+IDxwYXRoIGQ9Ik00OTYuMTQ1LDExMi45MDljLTkuNzM1LTkuNzU4LTIzLjM5Ni0xNS44NTUtMzguMjc4LTE1Ljg0NkgyMTIuNzYxYy0zLjAxMSwwLTUuOTMxLTEuMTQ3LTguMTUtMy4yMzUgbDAuMDE2LDAuMDI2bC00My4wNy00MC4zOWMtMTAuMDQtOS40MDUtMjMuMjcyLTE0LjY0My0zNy4wMjQtMTQuNjQzaC03MC40Yy0xNC44ODItMC4wMDgtMjguNTUyLDYuMDk2LTM4LjI3OCwxNS44NTYgQzYuMDk2LDY0LjQwMy0wLjAwOCw3OC4wNzIsMCw5Mi45NTR2MzI2LjA5MmMtMC4wMDgsMTQuODgyLDYuMDk2LDI4LjU1MSwxNS44NTUsMzguMjc3YzkuNzI2LDkuNzU5LDIzLjM5NiwxNS44NjMsMzguMjc4LDE1Ljg1NiBoNDAzLjczNGMxNC44ODIsMC4wMDgsMjguNTUyLTYuMDk2LDM4LjI3OC0xNS44NTZjOS43NTktOS43MjYsMTUuODYzLTIzLjM5NSwxNS44NTUtMzguMjc3VjE1MS4xODcgQzUxMi4wMDgsMTM2LjMwNSw1MDUuOTA0LDEyMi42MzYsNDk2LjE0NSwxMTIuOTA5eiBNNDY2LjI4Miw0MjcuNDUyYy0yLjIyOCwyLjE5NC01LjA2NSwzLjQ4MS04LjQxNCwzLjQ5SDU0LjEzMyBjLTMuMzUtMC4wMDgtNi4xODctMS4yOTYtOC40MTQtMy40OWMtMi4xODYtMi4yMTktMy40NzMtNS4wNTctMy40ODEtOC40MDZWOTIuOTU0YzAuMDA4LTMuMzUsMS4yOTUtNi4xODcsMy40ODEtOC40MTUgYzIuMjI4LTIuMTg2LDUuMDY1LTMuNDcyLDguNDE0LTMuNDgxaDcwLjRjMy4wMjgsMCw1LjkyMywxLjE0Nyw4LjE0MiwzLjIxOGw0My4wNjIsNDAuMzgxbDAuMDE2LDAuMDI1IGMxMC4wMTUsOS4zNjMsMjMuMjM5LDE0LjYxOCwzNy4wMDcsMTQuNjE4aDI0NS4xMDZjMy4zNSwwLjAwOCw2LjE5NiwxLjI5NSw4LjQxNCwzLjQ4MWMyLjE4NiwyLjIxOSwzLjQ3NCw1LjA1NywzLjQ4MSw4LjQwNiB2MjY3Ljg1OUM0NjkuNzU2LDQyMi4zOTUsNDY4LjQ2OCw0MjUuMjMzLDQ2Ni4yODIsNDI3LjQ1MnoiIHN0eWxlPSJmaWxsOiByZ2IoNzUsIDc1LCA3NSk7Ij48L3BhdGg+PC9nPjwvc3ZnPg==')
            no-repeat center;
          width: 1em;
          height: 1em;
          background-size: contain;
          margin-right: 0.5em;
        }

        .container {
          display: flex;
          height: 100vh;
        }

        .sidebar {
          height: 100%;
          width: 200px;
          background: #f0f0f0;
          padding: 1rem;
          box-sizing: border-box;
          border-right: 1px solid #ccc;
          overflow: auto;
        }

        .main-content {
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
        <nav class="sidebar">${sidebarListElement}</nav>
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
