import { html } from '../htmlHelper.js';

const imageContainerHtmlTemplate = html`
  <style>
    :host {
      display: block;
    }

    /* カードのスタイル */
    .card {
      display: flex;
      flex-direction: column;
      width: 100%;
      border: 1px solid #000;
      border-radius: 3px;
      background-color: #f5f5f5;
      overflow: hidden;
    }

    .card-header {
      color: var(--main-color-primary);
      background-color: var(--main-card-header-color-primary);
      padding: 0.5em 1em;
      border-bottom: 1px solid #000;
    }

    .card-body {
      display: flex;
      width: 100%;
      padding: 0.5em 1em;
      flex-wrap: wrap;
      gap: 20px 10px;
    }

    .card-footer {
      background-color: bisque;
      padding: 0.5em 1em;
      border-top: 1px solid #000;
    }
  </style>
  <div class="card">
    <div id="header" class="card-header">
      <slot name="header"></slot>
    </div>
    <div id="body" class="card-body">
      <slot></slot>
    </div>
    <div id="footer" class="card-footer">
      <slot name="footer"></slot>
    </div>
  </div>
`;

export const imageContainerScript = html`
  <script type="module">
    const template = document.createElement('template');
    template.innerHTML = \`${imageContainerHtmlTemplate}\`;

    class ImageContainer extends HTMLElement {
      updateHeaderFunc = () => this.updateHeader();
      updateFooterFunc = () => this.updateFooter();

      get headerSlot() {
        return this.shadowRoot.querySelector('slot[name="header"]');
      }

      get footerSlot() {
        return this.shadowRoot.querySelector('slot[name="footer"]');
      }

      get headerDiv() {
        return this.shadowRoot.getElementById('header');
      }

      get footerDiv() {
        return this.shadowRoot.getElementById('footer');
      }

      constructor() {
        super();
        const shadowRoot = this.attachShadow({ mode: 'open' });
        shadowRoot.appendChild(template.content.cloneNode(true));
      }

      connectedCallback() {
        this.headerSlot.addEventListener('slotchange', this.updateHeader);
        this.footerSlot.addEventListener('slotchange', this.updateFooter);
        this.updateHeader();
        this.updateFooter();
      }

      disconnectedCallback() {
        this.headerSlot.removeEventListener('slotchange', this.updateHeader);
        this.footerSlot.removeEventListener('slotchange', this.updateFooter);
      }

      updateHeader() {
        const nodes = this.headerSlot?.assignedNodes({ flatten: true });
        this.headerDiv.style.display = nodes.length > 0 ? 'block' : 'none';
      }

      updateFooter() {
        const nodes = this.footerSlot?.assignedNodes({ flatten: true });
        this.footerDiv.style.display = nodes.length > 0 ? 'block' : 'none';
      }
    }

    customElements.define('image-container', ImageContainer);
  </script>
`;
