import { escapeHtml, html } from '../htmlHelper.js';

export const LAZY_IMAGE_CLICK_EVENT_NAME = 'lazy-image-click';

const PHOTO_MAX_HEIGHT = 150;

const lazyImageHtmlTemplate = html`
  <style>
    :host {
      display: inline-block;
    }

    .photo {
      height: 100%;
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
  <script type="module">
    const imgIntersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.load();
        } else {
          entry.target.unload();
        }
      });
    });
    const onImgClick = (event) => {
      console.log(event.target);
      event.target.dispatchEvent(
        new CustomEvent('${LAZY_IMAGE_CLICK_EVENT_NAME}', {
          bubbles: true,
          composed: true,
          detail: {
            src: event.target.dataset.src,
          },
        }),
      );
    };

    const template = document.createElement('template');
    template.innerHTML = \`${lazyImageHtmlTemplate}\`;

    class LazyImg extends HTMLElement {
      img;

      constructor() {
        super();

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
          this.addEventListener('click', onImgClick);
        }
        imgIntersectionObserver.observe(this);
      }

      disconnectedCallback() {
        if (this.img) {
          this.removeEventListener('click', onImgClick);
        }
        imgIntersectionObserver.unobserve(this);
      }

      load() {
        const dataSrc = this.dataset.src;
        if (dataSrc) {
          this.img.src = dataSrc;
        }
      }

      unload() {
        this.img.src = '';
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
  const photoSize = fitContain(imageWidth, imageHeight, PHOTO_MAX_HEIGHT);
  return html`
    <lazy-img
      class="photo"
      data-src="${escapeHtml(filePath)}"
      data-alt="${fileName}"
      style="width:${photoSize.width}px;height:${photoSize.height}px;"
    >
    </lazy-img>
  `;
};

function fitContain(
  imageWidth: number,
  imageHeight: number,
  frameHeight: number,
): { width: number; height: number } {
  const scaleY = frameHeight / imageHeight;
  return {
    width: Math.round(imageWidth * scaleY),
    height: frameHeight,
  };
}
