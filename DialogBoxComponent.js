async function nextTick() {
    return new Promise(res => setTimeout(() => res()))
}

export const RESULT_OK = 1
export const RESULT_YES = 2
export const RESULT_NO = 3
export const RESULT_CANCEL = 4

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
                    transition: opacity 0.3s;
                }
                .none {
                    display: none;
                }
                .fader.faded {
                    opacity: 0;
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
                    transition: opacity 0.3s;
                }
                .dialog.faded {
                    opacity: 0;
                }
                #input {
                    background-color: var(--dbc-main-background-color);
                    color: var(--dbc-main-color);
                    border-color: gray;
                    border-style: solid;
                    border-width: 1px;
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
                .dialogButton.none {
                    display: none;
                }
            </style>
            <div class='dialogroot none'>
                <div class='fader faded'></div>
                <div class="dialogContainer">
                <div class="dialog faded" :class="{fullscreen: fullscreen}">
                    <p id="text" class="none"></p>
                    <input id="input" class="none" onClick="this.select();">
                    <div class="buttons">
                        <div id="btnOk" tabindex="1" @focus="onFocus" @blur="onBlur" 
                            class="dialogButton pointer-def none" :class="{default: isButtonOkDefault}">
                            OK
                        </div>
                        <div id="btnYes" tabindex="1" @focus="onFocus" @blur="onBlur" 
                            class="dialogButton pointer-def none" :class="{default: isButtonYesDefault}">
                            Ja
                        </div>                                        
                        <div id="btnNo" tabindex="2" @focus="onFocus" @blur="onBlur" 
                            class="dialogButton pointer-def none" :class="{default: isButtonNoDefault}">
                            Nein
                        </div>                                        
                        <div id="btnCancel" tabindex="3" @focus="onFocus" @blur="onBlur" 
                            class="dialogButton pointer-def none" :class="{default: isButtonCancelDefault}">
                            Abbrechen
                        </div>                                        
                    </div>                
                </div>                
            </div>
        ` 
        this.shadowRoot.appendChild(template.content.cloneNode(true))
        this.dialogroot = this.shadowRoot.querySelector('.dialogroot')
        this.fader = this.shadowRoot.querySelector('.fader')
        this.dialog = this.shadowRoot.querySelector('.dialog')
        this.text = this.shadowRoot.querySelector('#text')
        this.input = this.shadowRoot.querySelector('#input')
        this.btnOk = this.shadowRoot.querySelector('#btnOk')
        this.btnYes = this.shadowRoot.querySelector('#btnYes')
        this.btnNo = this.shadowRoot.querySelector('#btnNo')
        this.btnCancel = this.shadowRoot.querySelector('#btnCancel')
    }
    connectedCallback() {
        this.btnOk.onclick = () => {
            this.closeDialog(RESULT_OK)
        }
        this.btnYes.onclick = () => {
            this.closeDialog(RESULT_YES)
        }
        this.btnNo.onclick = () => {
            this.closeDialog(RESULT_NO)
        }
        this.btnCancel.onclick = () => {
            this.closeDialog(RESULT_CANCEL)
        }
    }

    show(settings) {

        const showBtn = (btn, show) => {
            if (show) {
                btn.style.width = null
                btn.classList.remove("none")
            }
            else 
                btn.classList.add("none")
        }

        if (settings.text) {
            this.text.classList.remove("none")
            this.text.innerHTML = settings.text
        }
        else
            this.text.classList.add("none")

        this.input.value = ""
        if (settings.input) 
            this.input.classList.remove("none")
        else 
            this.input.classList.add("none")

        showBtn(this.btnOk, settings.btnOk)
        showBtn(this.btnYes, settings.btnYes)
        showBtn(this.btnNo, settings.btnNo)
        showBtn(this.btnCancel, settings.btnCancel)

        const setWidths = () => {
            let width = 0
            if (settings.btnOk) {
                //this.focusables.push(this.$refs.btn1)
                width = this.btnOk.clientWidth
            }
            if (settings.btnYes) {
                //this.focusables.push(this.$refs.btn2)
                width = Math.max(width, this.btnYes.clientWidth)
            }
            if (settings.btnNo) {
                //this.focusables.push(this.$refs.btn3)
                width = Math.max(width, this.btnNo.clientWidth)
            }
            if (settings.btnCancel) {
                //this.focusables.push(this.$refs.btn4)
                width = Math.max(width, this.btnCancel.clientWidth)
            }
            if (settings.btnOk)
                this.btnOk.style.width = `${width}px`
            if (settings.btnYes)
                this.btnYes.style.width = `${width}px`
            if (settings.btnNo)
                this.btnNo.style.width = `${width}px`
            if (settings.btnCancel)
                this.btnCancel.style.width = `${width}px`
        }

        // TODO Keyboard 
        // TODO default button 
        // TODO Theming
        // TODO Slot
        // TODO Slide left
        // TODO Slide right
        // TODO Fullscreen?

        return new Promise(async res => {
            this.dialogroot.classList.remove("none")
            await nextTick()
            this.fader.classList.remove("faded")
            this.dialog.classList.remove("faded")
            setWidths()
            this.resolveDialog = res
        })
    }

    closeDialog(result) {

        const input = result == RESULT_OK || result == RESULT_YES ? this.input.value : undefined

        const transitionend = () => {
            this.fader.removeEventListener("transitionend", transitionend)
            this.dialogroot.classList.add("none")
            this.resolveDialog({result, input})
        }

        this.fader.addEventListener("transitionend", transitionend)
        this.fader.classList.add("faded")
        this.dialog.classList.add("faded")
    }
}

customElements.define('dialog-box-component', DialogBoxComponent)