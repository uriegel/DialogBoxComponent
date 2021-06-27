class DialogBoxComponent extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({ mode: 'open'})
        
        const template = document.createElement('template')
        template.innerHTML = `  
            <style>
                :host {
                    --dbc-fader-color: rgba(0, 0, 0, 0.50);            
                    --dbc-main-background-color: white;
                    --dbc-main-color: black;
                    --dbc-button-color: gray;
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
                .none {
                    display: none;
                }
                .dialogContainer {
                    position: fixed;
                    display: flex;
                    justify-content: center;
                    align-items: center;    
                    left: 0;
                    top: 0;
                    right: 0;
                    bottom: 0;                    
                }
                .dialog {
                    display: flex;
                    flex-direction: column;    
                    margin: 30px;
                    box-sizing: border-box;
                    padding: 30px;
                    border-radius: 5px;
                    color: var(--dbc-main-color);
                    background-color: var(--dbc-main-background-color);
                    z-index: 10;    
                    transform: translateX(0%);
                    box-shadow: 5px 4px 8px 2px rgba(0, 0, 0, 0.35), 0px 0px 20px 2px rgba(0, 0, 0, 0.25);
                }
                .buttons {
                    display: flex;
                    margin-top: 20px;
                }
                .dialogButton {
                    display: inline-block;
                    background-color: var(--dbc-button-color);
                    outline-color: var(--dbc-main-background-color);
                    user-select: none;
                    color: white;
                    text-align: center;
                    padding: 2px 7px;
                    /* line-height: 20px; */
                    transition: background-color 0.3s, outline-color 400ms;
                    border-radius: 3px;
                    margin-left: 5px;
                }                
            </style>
            <div class='dialogroot none'>
                <div class='fader'></div>
                <div class="dialogContainer">
                <div class="dialog" :class="{fullscreen: fullscreen}">
                    <div class="buttons">
                        <div id="btnOk" tabindex="1" v-if="ok" @focus="onFocus" @blur="onBlur" 
                            class="dialogButton pointer-def" :class="{default: isButtonOkDefault}"
                            @keydown=keydownOk>
                            OK
                        </div>                
                    </div>                
                </div>                
            </div>
        ` 
        this.shadowRoot.appendChild(template.content.cloneNode(true))
        this.dialogroot = this.shadowRoot.querySelector('.dialogroot')
        this.btnOk = this.shadowRoot.querySelector('#btnOk')
    }
    connectedCallback() {
        this.btnOk.onclick = () => {
            this.dialogroot.classList.add("none")
            this.resolveDialog()
        }
    }

    show() {
        return new Promise((res, rej) => {
            this.dialogroot.classList.remove("none")
            this.resolveDialog = res
        })
    }
}

customElements.define('dialog-box-component', DialogBoxComponent)