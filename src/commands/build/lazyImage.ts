import { escapeHtml, html } from './htmlHelper.js';

export const LAZY_IMAGE_CLICK_EVENT_NAME = 'lazy-image-click';

const PHOTO_MAX_SIZE = {
  width: 210,
  height: 150,
};

const lazyImageHtmlTemplate = html`
  <style>
    :host {
      display: inline-block;
    }
    .photo {
      object-fit: contain;
      box-shadow: 10px 5px 5px #bbbbbb;
    }
    .photo:hover {
      cursor: pointer;
    }
  </style>
  <img src="" id="photo" class="photo" alt="" />
`;

export const lazyImageScript = html`
  <script>
    const template = document.createElement('template');
    template.innerHTML = \`${lazyImageHtmlTemplate}\`;

    class LazyImg extends HTMLElement {
      intersectionObserver;
      img;
      onImgClick = () =>
        this.dispatchEvent(
          new CustomEvent(LAZY_IMAGE_CLICK_EVENT_NAME, {
            bubbles: true,
            composed: true,
            detail: {
              src: this.dataset.src,
            },
          }),
        );

      constructor() {
        super();
        this.intersectionObserver = null;

        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(template.content.cloneNode(true));
        this.img = this.shadowRoot.getElementById('photo');

        const alt = this.dataset.alt;
        if (alt) {
          this.img.alt = alt;
        }
      }

      connectedCallback() {
        if (this.img) {
          this.img.addEventListener('click', this.onImgClick);
        }
        const src = this.dataset.src;

        if (src) {
          this.intersectionObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                // 表示領域内に入った場合は画像を読み込み
                this.img.src = src;
              } else {
                // 表示領域外に出た場合は画像を解放
                this.img.src = '';
              }
            });
          });
          this.intersectionObserver.observe(this);
        }
      }

      disconnectedCallback() {
        if (this.img) {
          this.img.removeEventListener('click', this.onImgClick);
        }
        if (this.intersectionObserver) {
          this.intersectionObserver.disconnect();
          this.intersectionObserver = null;
        }
      }
    }

    customElements.define('lazy-img', LazyImg);
  </script>
`;

export const createLazyImage = (
  filePath: string,
  fileName: string,
  imageWidth: number,
  imageHeight: number,
) => {
  const photoSize = fitContain(
    imageWidth,
    imageHeight,
    PHOTO_MAX_SIZE.width,
    PHOTO_MAX_SIZE.height,
  );
  return html`
    <lazy-img
      class="photo"
      data-src="${escapeHtml(filePath)}"
      data-alt="${fileName}"
      width="${photoSize.width}"
      height="${photoSize.height}"
    ></lazy-img>
  `;
};

function fitContain(
  imageWidth: number,
  imageHeight: number,
  frameWidth: number,
  frameHeight: number,
): { width: number; height: number } {
  const scaleX = frameWidth / imageWidth;
  const scaleY = frameHeight / imageHeight;
  const scale = Math.min(scaleX, scaleY);
  return {
    width: Math.round(imageWidth * scale),
    height: Math.round(imageHeight * scale),
  };
}
