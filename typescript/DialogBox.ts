
export enum Result {
    Ok, Yes, No, Cancel
} 

export type DialogResult = {
    result: Result
    input: string | undefined
}

export type Settings = {
    btnOk?: boolean
    btnYes?: boolean
    btnNo?: boolean
    btnCancel?: boolean 
    defBtnOk?: boolean
    defBtnYes?: boolean
    defBtnNo?: boolean
    defBtnCancel?: boolean
    text?: string
    extended?: string
    inputText?: string | undefined
    inputSelectRange?: number[]
    onExtendedResult?: (result: any)=>void
    fullscreen?: boolean
    slide?: boolean
    slideReverse?: boolean
}

export class DialogBox extends HTMLElement {
    private dialogroot: HTMLElement
    private dialogContainer: HTMLElement
    private fader: HTMLElement
    private dialog: HTMLElement
    private text: HTMLElement
    private input: HTMLInputElement
    private btnOk: HTMLElement
    private btnYes: HTMLElement
    private btnNo: HTMLElement
    private btnCancel: HTMLElement
    private defBtn: HTMLElement | undefined 
    private extendedContent: HTMLSlotElement
    private resolveDialog?: (result: DialogResult)=>void
    private focusIndex = 0
    private cancel = false
    private no = false
    private focusables: HTMLElement[] = []
    private inputSelectRange?: number[]
    private slide = false
    private slideReverse = false
    private buttonHasFocus = false
    private extendedFocusables: HTMLElement[] | undefined | null
    private onExtendedResult? (result: any):void
    private dialogStyle: HTMLStyleElement | undefined
    
    constructor() {
        super()

        this.dialogStyle = document.createElement("style")
        document.head.appendChild(this.dialogStyle)
        this.dialogStyle.sheet?.insertRule(`:root {
            --wdb-main-background-color: white;
            --wdb-main-color: black;
            --wdb-fader-color: rgba(0, 0, 0, 0.50);            
            --wdb-button-color: white;
            --wdb-button-background-color: blue;
            --wdb-button-hover-background-color: #7979ff;
            --wdb-button-active-background-color: #01018e;
            --wdb-button-focus-color: blue;    
            --wdb-button-margin: 20px 30px 30px 30px;
            --wdb-button-flexgrow: 0;
            --wdb-button-marginleft: 5px;
            --wdb-button-cornerradius: 3px;
            --wdb-button-bordercolor: transparent;
            --wdb-button-borderstyle: none;
            --wdb-button-borderwidth: 0px;
            --wdb-button-buttomradius: 3px;
            --wdb-button-padding: 2px 7px;
            --wdb-button-outlinestyle: solid;
            --wdb-button-outlineoffset: 1px;
            --wdb-input-selection-color: blue;
            --wdb-animation-duration: 0.3s;
        }`)
        this.dialogStyle.sheet!.insertRule('.wdb-none { display: none }') 

        this.attachShadow({ mode: 'open'})
        
        const template = document.createElement('template')
        template.innerHTML = `  
            <style>
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
                    background-color: var(--wdb-fader-color);
                    transition: opacity var(--wdb-animation-duration);
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
                    transform: translateX(0%);
                    transition: transform var(--wdb-animation-duration);
                }
                .dialogContainer.leftTranslated {
                    transform: translateX(-50%);
                }
                .dialogContainer.rightTranslated {
                    transform: translateX(50%);
                }
                .dialog {
                    display: flex;
                    margin: 30px;
                    flex-direction: column;    
                    border-radius: 5px;
                    color: var(--wdb-main-color);
                    background-color: var(--wdb-main-background-color);
                    z-index: 10;    
                    box-shadow: 5px 4px 8px 2px rgba(0, 0, 0, 0.35), 0px 0px 20px 2px rgba(0, 0, 0, 0.25);
                    transition: opacity var(--wdb-animation-duration);
                }
                .dialog.faded {
                    opacity: 0;
                }
                .dialog.fullscreen{
                    width: 100%;
                    height: 90%;
                }
                .dialogContent {
                    display: flex;
                    flex-grow: 1;
                    flex-direction: column;    
                    box-sizing: border-box;
                    padding: 30px 30px 0px 30px;
                }
                #input {
                    background-color: var(--wdb-main-background-color);
                    color: var(--wdb-main-color);
                    border-color: gray;
                    border-style: solid;
                    border-width: 1px;
                }
                #input:focus {
                    outline-color: var(--wdb-input-selection-color);
                    border-color: transparent;
                    outline-width: 1px;
                    outline-style: solid;
                }
                #input::selection {
                    color: white;
                    background-color: var(--wdb-input-selection-color);
                }                
                .buttons {
                    display: flex;
                    margin: var(--wdb-button-margin);
                }
                .dialogButton {
                    display: inline-block;
                    flex-grow: var(--wdb-button-flexgrow);
                    background-color: var(--wdb-button-background-color);
                    outline-color: var(--wdb-main-background-color);
                    user-select: none;
                    color: var(--wdb-button-color);
                    text-align: center;
                    padding: var(--wdb-button-padding);
                    /* line-height: 20px; */
                    transition: background-color var(--wdb-animation-duration), outline-color 400ms;
                    border-radius: var(--wdb-button-cornerradius);
                    margin-left: var(--wdb-button-marginleft);
                    border-color: var(--wdb-button-bordercolor);
                    border-style: var(--wdb-button-borderstyle);
                    border-width: var(--wdb-button-borderwidth);
                }                
                .dialogButton.none {
                    display: none;
                }
                .firstButton {
                    margin-left: auto;
                    border-bottom-left-radius: var(--wdb-button-buttomradius);
                    border-left-width: var(--wdb-button-first-borderwidth);
                }                
                .lastButton {
                    border-bottom-right-radius: var(--wdb-button-buttomradius);
                }                
                .dialogButton:hover {
                    background-color: var(--wdb-button-hover-background-color);
                }     
                .dialogButton:active, .buttonActive {
                    background-color: var(--wdb-button-active-background-color);
                }
                .dialogButton.default {
                    outline-color: gray;
                    outline-width: 1px;
                    outline-style: var(--wdb-button-outlinestyle);
                    outline-offset: var(--wdb-button-outlineoffset);
                }
                .dialogButton:focus {
                    outline-color: var(--wdb-button-focus-color);
                    outline-width: 1px;
                    outline-style: var(--wdb-button-outlinestyle);
                    outline-offset: var(--wdb-button-outlineoffset);
                }                         
            </style>
            <div class='dialogroot none'>
                <div class='fader faded'></div>
                <div class="dialogContainer">
                <div class="dialog faded">
                    <div class="dialogContent">
                        <p id="text" class="none"></p>
                        <input id="input" class="none" onClick="this.select();">
                        <slot id="extendedContent"></slot>
                    </div>                    
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
        this.shadowRoot!.appendChild(template.content.cloneNode(true))
        this.dialogroot = this.shadowRoot!.querySelector('.dialogroot')!
        this.dialogContainer = this.shadowRoot!.querySelector('.dialogContainer')!
        this.fader = this.shadowRoot!.querySelector('.fader')!
        this.dialog = this.shadowRoot!.querySelector('.dialog')!
        this.text = this.shadowRoot!.querySelector('#text')!
        this.input = this.shadowRoot!.querySelector('#input')!
        this.btnOk = this.shadowRoot!.querySelector('#btnOk')!
        this.btnYes = this.shadowRoot!.querySelector('#btnYes')!
        this.btnNo = this.shadowRoot!.querySelector('#btnNo')!
        this.btnCancel = this.shadowRoot!.querySelector('#btnCancel')!
        this.extendedContent = this.shadowRoot!.querySelector('#extendedContent')!
    }
    connectedCallback() {
        this.btnOk.onclick = () => this.closeDialog(Result.Ok)
        this.btnOk.onkeydown = evt => {
            if (evt.which == 13 || evt.which == 32) {
                this.closeDialog(Result.Ok)
                evt.stopPropagation()
            }
        }
        this.btnOk.onfocus = () => this.focusButton(true)
        this.btnOk.onblur = () => this.focusButton(false)

        this.btnYes.onclick = () => this.closeDialog(Result.Yes)
        this.btnYes.onkeydown = evt => {
            if (evt.which == 13 || evt.which == 32) {
                this.closeDialog(Result.Yes)
                evt.stopPropagation()
            }
        }
        this.btnYes.onfocus = () => this.focusButton(true)
        this.btnYes.onblur = () => this.focusButton(false)

        this.btnNo.onclick = () => this.closeDialog(Result.No)
        this.btnNo.onkeydown = evt => {
            if (evt.which == 13 || evt.which == 32) {
                this.closeDialog(Result.No)
                evt.stopPropagation()
            }
        }
        this.btnNo.onfocus = () => this.focusButton(true)
        this.btnNo.onblur = () => this.focusButton(false)

        this.btnCancel.onclick = () => this.closeDialog(Result.Cancel)
        this.btnCancel.onkeydown = evt => {
            if (evt.which == 13 || evt.which == 32) {
                this.closeDialog(Result.Cancel)
                evt.stopPropagation()
            }
        }
        this.btnCancel.onfocus = () => this.focusButton(true)
        this.btnCancel.onblur = () => this.focusButton(false)

        this.input.onfocus = () => setTimeout(() => {
            if (this.inputSelectRange)
                this.input.setSelectionRange(this.inputSelectRange[0], this.inputSelectRange[1])
            else
                this.input.select()
        })

        this.dialog.addEventListener("focusin", () => {
            this.focusIndex = this.focusables.findIndex(n => n == this.shadowRoot!.activeElement || n == document.activeElement)
            if (this.focusIndex == -1)
                this.focusIndex = 0
        })

        this.dialog.onkeydown = evt => this.onKeydown(evt)
    }

    show(settings: Settings) {

        this.dialogClosed()

        const showBtn = (btn: HTMLElement, show: boolean | undefined) => {
            if (show) {
                btn.style.width = ""
                btn.classList.remove("none")
            }
            else 
                btn.classList.add("none")
        }

        this.extendedContent
            .assignedElements()
            .forEach(n => n.classList.add("wdb-none"))
        this.onExtendedResult = settings.onExtendedResult

        const extendedContent = settings.extended ? document.getElementById(settings.extended) : null
        if (extendedContent) 
            extendedContent.classList.remove("wdb-none")

        if (settings.text) {
            this.text.classList.remove("none")
            this.text.innerHTML = settings.text
        }
        else
            this.text.classList.add("none")

        this.input.value = ""
        if (settings.inputText != undefined) {
            this.input.classList.remove("none")
            this.input.value = settings.inputText ?? ""
        }
        else 
            this.input.classList.add("none")

        showBtn(this.btnOk, settings.btnOk)
        showBtn(this.btnYes, settings.btnYes)
        showBtn(this.btnNo, settings.btnNo)
        showBtn(this.btnCancel, settings.btnCancel)

        this.btnOk.classList.remove("firstButton")
        this.btnOk.classList.remove("lastButton")
        this.btnYes.classList.remove("firstButton")
        this.btnYes.classList.remove("lastButton")
        this.btnNo.classList.remove("firstButton")
        this.btnNo.classList.remove("lastButton")
        this.btnCancel.classList.remove("firstButton")
        this.btnCancel.classList.remove("lastButton")
        const firstButton = settings.btnOk 
            ? this.btnOk
            : settings.btnYes
            ? this.btnYes
            : settings.btnNo
            ? this.btnNo
            : this.btnCancel
        firstButton.classList.add("firstButton")
        const lastButton = settings.btnCancel
            ? this.btnCancel
            : settings.btnNo
            ? this.btnNo
            : settings.btnYes
            ? this.btnYes
            : this.btnOk
            lastButton.classList.add("lastButton")

        this.cancel = settings.btnCancel ?? false
        this.no = settings.btnNo ?? false

        const setWidths = () => {
            if (settings.fullscreen)
                this.dialog.classList.add("fullscreen")
            else
                this.dialog.classList.remove("fullscreen")

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

            const flexGrowButton = parseInt(getComputedStyle(document.body).getPropertyValue('--wdb-button-flexgrow'), 10);
            const buttonWidth = flexGrowButton && settings.fullscreen ? `10px` : `${width}px`
            if (settings.btnOk)
                this.btnOk.style.width = buttonWidth
            if (settings.btnYes)
                this.btnYes.style.width = buttonWidth
            if (settings.btnNo)
                this.btnNo.style.width = buttonWidth
            if (settings.btnCancel)
                this.btnCancel.style.width = buttonWidth

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
                this.defBtn = undefined
            if (this.defBtn && settings.inputText == undefined && !this.extendedFocusables)
                setTimeout(() => this.defBtn?.focus())
        }
        
        return new Promise<DialogResult>(async res => {
            this.slide = settings.slide ?? false
            this.slideReverse = settings.slideReverse ?? false
            if (settings.slide)
                this.dialogContainer.classList.add("leftTranslated")
            if (settings.slideReverse)
                this.dialogContainer.classList.add("rightTranslated")
            this.dialogroot.classList.remove("none")

            const checkVisible = async () => {
                return new Promise((res: any) => {
                    var observer = new IntersectionObserver((e, o)  => {
                        o.unobserve(this.dialogroot)
                        res()
                    }, { root: document.documentElement })
                    observer.observe(this.dialogroot)
                })
            }
            await checkVisible()
    
            this.fader.classList.remove("faded")
            this.dialog.classList.remove("faded")
            this.dialogContainer.classList.remove("leftTranslated")
            this.dialogContainer.classList.remove("rightTranslated")
            this.focusables = []
            if (settings.inputText != undefined) {
                this.focusables.push(this.input)
                if (settings.inputSelectRange)
                    this.inputSelectRange = settings.inputSelectRange
            }
            this.extendedFocusables = extendedContent ? [...extendedContent.querySelectorAll(".wdb-focusable")] as HTMLElement[] : null
            if (extendedContent && extendedContent.classList.contains("wdb-focusable"))
                this.focusables = this.focusables.concat([extendedContent])
            if (this.extendedFocusables)
                this.focusables = this.focusables.concat(this.extendedFocusables)
            setWidths()
            this.focusIndex = 0 
            if (this.focusables.length > 0)
                this.focusables[this.focusIndex].focus()        
            this.resolveDialog = res
        })
    }

    onKeydown(evt: KeyboardEvent) {
        switch (evt.which) {
            case 9: { // tab
                const setFocus = () => {
                    this.focusIndex = evt.shiftKey ? this.focusIndex - 1 : this.focusIndex + 1
                    if (this.focusIndex >= this.focusables.length)
                        this.focusIndex = 0
                    if (this.focusIndex < 0)
                        this.focusIndex = this.focusables.length - 1
                    const element = this.focusables[this.focusIndex]
                    if (!(element as any).disabled) {
                        element.focus()
                        return true
                    }
                    return false
                }
                while (!setFocus());
                break
            }        
            case 13: // Return
                if (this.defBtn && !this.buttonHasFocus) {
                    const result = 
                        this.defBtn == this.btnOk
                        ? Result.Ok
                        : this.defBtn == this.btnYes
                        ? Result.Yes
                        : this.defBtn == this.btnNo
                        ? Result.No
                        : Result.Cancel
                    this.closeDialog(result)
                }
                break
            case 27: // ESC
                if (this.cancel || !this.no) 
                    this.closeDialog(Result.Cancel)
                break            
            default:
                return
        }
        evt.preventDefault()
        evt.stopPropagation()            
    }

    private dialogClosed = () => {
        if (!this.dialogroot.classList.contains("none")) {
            this.fader.removeEventListener("transitionend", this.dialogClosed)
            this.dialogStyle?.remove()
            this.dialogroot.classList.add("none")
            this.dialogContainer.classList.remove("rightTranslated")
            this.dialogContainer.classList.remove("leftTranslated")
            this.dispatchEvent(new CustomEvent('dialogClosed'))
        }
    }

    closeDialog(result: Result) {
        const input = result == Result.Ok || result == Result.Yes ? this.input.value : undefined


        this.fader.addEventListener("transitionend", this.dialogClosed)
        if (this.slide) 
            this.dialogContainer.classList.add(result == Result.Ok || result == Result.Yes || (result == Result.No && this.cancel) 
            ? "rightTranslated" 
            : "leftTranslated")    
        if (this.slideReverse) 
            this.dialogContainer.classList.add(result == Result.Ok || result == Result.Yes || (result == Result.No && this.cancel) 
            ? "leftTranslated" 
            : "rightTranslated")    
        this.fader.classList.add("faded")
        this.dialog.classList.add("faded")

        const dialogResult = {result, input}
        if ((result == Result.Ok || result == Result.Yes) && this.onExtendedResult)
            this.onExtendedResult(dialogResult)
        this.resolveDialog!(dialogResult)
    }

    focusButton(focus: boolean) {
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

customElements.define('dialog-box', DialogBox)

