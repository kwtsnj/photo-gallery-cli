import { html } from './htmlHelper.js';
import { LAZY_IMAGE_CLICK_EVENT_NAME, lazyImageScript } from './lazyImage.js';

// language=html
export const pageTemplate = (gallery: string) => html`
  <!DOCTYPE html>
  <html lang="ja">
    <head>
      <meta charset="UTF-8" />
      <title>Photo Gallery</title>
      <style>
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

        .container {
          display: flex;
          width: 100%;
          flex-wrap: wrap;
          background-color: lavender;
          gap: 20px 10px;
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
      <div>${gallery}</div>
      ${lazyImageScript}
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
