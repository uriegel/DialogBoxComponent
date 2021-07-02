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
                    --dbc-main-background-color: white;
                    --dbc-main-color: black;
                    --dbc-fader-color: rgba(0, 0, 0, 0.50);            
                    --dbc-button-color: blue;
                    --dbc-button-hover-color: #7979ff;
                    --dbc-button-active-color: #01018e;
                    --dbc-button-focus-color: blue;    
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
                #input:focus {
                    outline-color: var(--dbc-button-active-color);
                    border-color: transparent;
                    outline-width: 1px;
                    outline-style: solid;
                }
                #input::selection {
                    color: white;
                    background-color: var(--dbc-button-color);
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
                .dialogButton:hover {
                    background-color: var(--dbc-button-hover-color);
                }     
                .dialogButton:active, .buttonActive {
                    background-color: var(--dbc-button-active-color);
                }
                .dialogButton.default {
                    outline-color: gray;
                    outline-width: 1px;
                    outline-style: solid;
                    outline-offset: 1px;
                }
                .dialogButton:focus {
                    outline-color: var(--dbc-button-focus-color);
                    outline-width: 1px;
                    outline-style: solid;
                    outline-offset: 1px;
                }                           
            </style>
            <div class='dialogroot none'>
                <div class='fader faded'></div>
                <div class="dialogContainer">
                <div class="dialog faded" :class="{fullscreen: fullscreen}">
                    <p id="text" class="none"></p>
                    <input id="input" class="none" onClick="this.select();">
                    <div class="buttons">
                        <div id="btnOk" tabindex="1" 
                            class="dialogButton pointer-def none" >
                            OK
                        </div>
                        <div id="btnYes" tabindex="1"
                            class="dialogButton pointer-def none" >
                            Ja
                        </div>                                        
                        <div id="btnNo" tabindex="2" 
                            class="dialogButton pointer-def none" >
                            Nein
                        </div>                                        
                        <div id="btnCancel" tabindex="3" 
                            class="dialogButton pointer-def none" >
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
        this.btnOk.onkeydown = evt => {
            if (evt.which == 13 || evt.which == 32) 
                this.closeDialog(RESULT_OK)
        }
        this.btnOk.onfocus = () => this.focusButton(true)
        this.btnOk.onblur = () => this.focusButton(false)

        this.btnYes.onclick = () => {
            this.closeDialog(RESULT_YES)
        }
        this.btnYes.onkeydown = evt => {
            if (evt.which == 13 || evt.which == 32) 
                this.closeDialog(RESULT_YES)
        }
        this.btnYes.onfocus = () => this.focusButton(true)
        this.btnYes.onblur = () => this.focusButton(false)

        this.btnNo.onclick = () => {
            this.closeDialog(RESULT_NO)
        }
        this.btnNo.onkeydown = evt => {
            if (evt.which == 13 || evt.which == 32) 
                this.closeDialog(RESULT_NO)
        }
        this.btnNo.onfocus = () => this.focusButton(true)
        this.btnNo.onblur = () => this.focusButton(false)

        this.btnCancel.onclick = () => {
            this.closeDialog(RESULT_CANCEL)
        }
        this.btnCancel.onkeydown = evt => {
            if (evt.which == 13 || evt.which == 32) 
                this.closeDialog(RESULT_CANCEL)
        }
        this.btnCancel.onfocus = () => this.focusButton(true)
        this.btnCancel.onblur = () => this.focusButton(false)

        this.input.onfocus = () => setTimeout(() => this.input.select())

        this.dialog.onkeydown = evt => this.onKeydown(evt)
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
        if (settings.input) {
            this.input.classList.remove("none")
            this.input.value = settings.inputText
        }
        else 
            this.input.classList.add("none")

        showBtn(this.btnOk, settings.btnOk)
        showBtn(this.btnYes, settings.btnYes)
        showBtn(this.btnNo, settings.btnNo)
        showBtn(this.btnCancel, settings.btnCancel)

        this.cancel = settings.btnCancel
        this.no = settings.btnNo

        const setWidths = () => {
            let width = 0
            if (settings.btnOk) {
                this.focusables.push(this.btnOk)
                width = this.btnOk.clientWidth
            }
            if (settings.btnYes) {
                this.focusables.push(this.btnYes)
                width = Math.max(width, this.btnYes.clientWidth)
            }
            if (settings.btnNo) {
                this.focusables.push(this.btnNo)
                width = Math.max(width, this.btnNo.clientWidth)
            }
            if (settings.btnCancel) {
                this.focusables.push(this.btnCancel)
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

            this.btnOk.classList.remove("default")                
            this.btnYes.classList.remove("default")                
            this.btnNo.classList.remove("default")                
            this.btnCancel.classList.remove("default")                

            if (settings.defBtnOk) {
                this.btnOk.classList.add("default")
                this.defBtn = this.btnOk
            }
            else if (settings.defBtnYes) {
                this.btnYes.classList.add("default")
                this.defBtn = this.btnYes
            }
            else if (settings.defBtnNo) {
                this.btnNo.classList.add("default")
                this.defBtn = this.btnNo
            }
            else if (settings.defBtnCancel) {
                this.btnCancel.classList.add("default")
                this.defBtn = this.btnCancel
            } else
                this.defBtn = null
        }

        // TODO Theming (commander old version)
        // TODO Slot (field with checkbox (rename -> checkbox))
        // TODO Slide left
        // TODO Slide right
        // TODO Fullscreen?

        return new Promise(async res => {
            this.dialogroot.classList.remove("none")
            await nextTick()
            this.fader.classList.remove("faded")
            this.dialog.classList.remove("faded")
            this.focusables = []
            if (settings.input)
                this.focusables.push(this.input)
            setWidths()
            this.focusIndex = 0 
            this.focusables[this.focusIndex].focus()        
            this.resolveDialog = res
        })
    }

    onKeydown(evt) {
        switch (evt.which) {
            case 9: { // tab
                const active = document.activeElement
                const setFocus = () => {
                    this.focusIndex = evt.shiftKey ? this.focusIndex - 1 : this.focusIndex + 1
                    if (this.focusIndex >= this.focusables.length)
                        this.focusIndex = 0
                    if (this.focusIndex < 0)
                        this.focusIndex = this.focusables.length - 1
                    this.focusables[this.focusIndex].focus()
                    // if (document.activeElement == active)
                    //     setFocus()    
                }
                setFocus()
                break
            }        
            case 13: // Return
                if (this.defBtn && !this.buttonHasFocus) {
                    const result = 
                        this.defBtn == this.btnOk
                        ? RESULT_OK
                        : this.defBtn == this.btnYes
                        ? RESULT_YES
                        : this.defBtn == this.btnNo
                        ? RESULT_NO
                        : RESULT_CANCEL
                    this.closeDialog(result)
                }
                break
            case 27: // ESC
                if (this.cancel || !this.no) 
                    this.closeDialog(RESULT_CANCEL)
                break            
            default:
                return
        }
        evt.preventDefault()
        evt.stopPropagation()            
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

    focusButton(focus) {
        if (this.defBtn) {
            if (focus) {
                this.defBtn.classList.remove("default")
                this.buttonHasFocus = true
            }
            else {
                this.defBtn.classList.add("default")
                this.buttonHasFocus = false
            }
        }
    }
}

customElements.define('dialog-box-component', DialogBoxComponent)