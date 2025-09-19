import { html } from '../htmlHelper.js';

const imageContainerHtmlTemplate = html`
  <style>
    :host {
      display: block;
    }

    .container {
      display: flex;
      width: 100%;
      flex-wrap: wrap;
      gap: 20px 10px;
    }
  </style>
  <div class="container">
    <slot></slot>
  </div>
`;

export const imageContainerScript = html`
  <script type="module">
    const template = document.createElement('template');
    template.innerHTML = \`${imageContainerHtmlTemplate}\`;

    class ImageContainer extends HTMLElement {
      constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(template.content.cloneNode(true));
      }
    }

    customElements.define('image-container', ImageContainer);
  </script>
`;
