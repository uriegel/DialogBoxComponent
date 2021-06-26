class DialogBoxComponent extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({ mode: 'open'})
        
        const template = document.createElement('template')
        template.innerHTML = `  
            <style>
                :host {
                    --dbc-fader-color: rgba(0, 0, 0, 0.50);            
                }
                .dialogroot {
                    position: absolute;
                    width: 100%;
                    height: 100%;            
                }
                .fader {
                    position: fixed;
                    width: 100%;
                    height: 100%;
                    top: 0px;
                    opacity: 1;
                    background-color: var(--dbc-fader-color);
                }
            </style>
            <div class='dialogroot'>
                <div class='fader'>

                </div>
            </div>
        ` 
        this.shadowRoot.appendChild(template.content.cloneNode(true))
    }
}

customElements.define('dialog-box-component', DialogBoxComponent)