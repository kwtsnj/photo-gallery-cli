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

        ul {
          padding-left: 0.5em;
          list-style: none;
        }

        li::before {
          content: '';
          display: inline-block;
          background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2ZXJzaW9uPSIxLjEiIHdpZHRoPSIyNTYiIGhlaWdodD0iMjU2IiB2aWV3Qm94PSIwIDAgMjU2IDI1NiIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+CiAgPGcgc3R5bGU9InN0cm9rZTogbm9uZTsgc3Ryb2tlLXdpZHRoOiAwOyBzdHJva2UtZGFzaGFycmF5OiBub25lOyBzdHJva2UtbGluZWNhcDogYnV0dDsgc3Ryb2tlLWxpbmVqb2luOiBtaXRlcjsgc3Ryb2tlLW1pdGVybGltaXQ6IDEwOyBmaWxsOiBub25lOyBmaWxsLXJ1bGU6IG5vbnplcm87IG9wYWNpdHk6IDE7IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxLjQwNjU5MzQwNjU5MzQwMTYgMS40MDY1OTM0MDY1OTM0MDE2KSBzY2FsZSgyLjgxIDIuODEpIj4KICAgIDxwYXRoIGQ9Ik0gMCA2OC43OTggdiAxMS45MTQgYyAwIDEuNzEzIDEuNDAxIDMuMTE0IDMuMTE0IDMuMTE0IGggMCBjIDMuMzQ0IDAgNC44MDUgLTIuNjQyIDQuODA1IC0yLjY0MiBMIDguMTQgMjkuMjgxIGwgMi43MzkgLTIuODI3IGwgNzIuODk0IC0yLjk3NyB2IC0xLjQ4MiBjIDAgLTIuMzk2IC0xLjk0MiAtNC4zMzggLTQuMzM4IC00LjMzOCBIIDUwLjIzNiBjIC0xLjE1IDAgLTIuMjU0IC0wLjQ1NyAtMy4wNjcgLTEuMjcgbCAtOC45NDMgLTguOTQzIGMgLTAuODEzIC0wLjgxMyAtMS45MTcgLTEuMjcgLTMuMDY3IC0xLjI3IEggNC4zMzggQyAxLjk0MiA2LjE3NCAwIDguMTE2IDAgMTAuNTEyIHYgNy4xNDYgdiAyLjMzMiBWIDY4Ljc5OCIgc3R5bGU9InN0cm9rZTogbm9uZTsgc3Ryb2tlLXdpZHRoOiAxOyBzdHJva2UtZGFzaGFycmF5OiBub25lOyBzdHJva2UtbGluZWNhcDogYnV0dDsgc3Ryb2tlLWxpbmVqb2luOiBtaXRlcjsgc3Ryb2tlLW1pdGVybGltaXQ6IDEwOyBmaWxsOiByZ2IoMjI0LDE3Myw0OSk7IGZpbGwtcnVsZTogbm9uemVybzsgb3BhY2l0eTogMTsiIHRyYW5zZm9ybT0iIG1hdHJpeCgxIDAgMCAxIDAgMCkgIiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KICAgIDxwYXRoIGQ9Ik0gMy4xMTQgODMuODI2IEwgMy4xMTQgODMuODI2IGMgMS43MTMgMCAzLjExNCAtMS40MDEgMy4xMTQgLTMuMTE0IFYgMjcuODEgYyAwIC0yLjM5MyAxLjk0IC00LjMzMyA0LjMzMyAtNC4zMzMgaCA3NS4xMDcgYyAyLjM5MyAwIDQuMzMzIDEuOTQgNC4zMzMgNC4zMzMgdiA1MS42ODQgYyAwIDIuMzkzIC0xLjk0IDQuMzMzIC00LjMzMyA0LjMzMyBDIDg1LjY2NyA4My44MjYgMy4xMTQgODMuODI2IDMuMTE0IDgzLjgyNiB6IiBzdHlsZT0ic3Ryb2tlOiBub25lOyBzdHJva2Utd2lkdGg6IDE7IHN0cm9rZS1kYXNoYXJyYXk6IG5vbmU7IHN0cm9rZS1saW5lY2FwOiBidXR0OyBzdHJva2UtbGluZWpvaW46IG1pdGVyOyBzdHJva2UtbWl0ZXJsaW1pdDogMTA7IGZpbGw6IHJnYigyNTUsMjAwLDY3KTsgZmlsbC1ydWxlOiBub256ZXJvOyBvcGFjaXR5OiAxOyIgdHJhbnNmb3JtPSIgbWF0cml4KDEgMCAwIDEgMCAwKSAiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPgogIDwvZz4KPC9zdmc+');
          width: 1em;
          height: 1em;
          background-size: contain;
          margin-right: 0.5em;
        }

        ul span {
          color: var(--sidebar-color-secondary);
        }

        ul a,
        a:visited,
        a:hover,
        a:active {
          color: var(--sidebar-color-primary);
          text-decoration: none;
        }

        ul a:hover {
          text-decoration: underline;
        }

        .container {
          display: flex;
          height: 100vh;
        }

        .sidebar-content {
          height: 100%;
          width: 200px;
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
