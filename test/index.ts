import '../src/index.js'
import { DialogBox } from '../src/index.js'

const dialogBoxComponent = document.getElementById('dialogBoxComponent')! as DialogBox
const themeChooser = document.getElementById("themeChooser")! as HTMLSelectElement

themeChooser.onchange = () => {
    const changeTheme = (theme: string) => {
        ["themeBlue", "themeAdwaita", "themeAdwaitaDark"].forEach(n => 
            document.body.classList.remove(n)    
        )
        document.body.classList.add(theme)    
    }

    switch (themeChooser.selectedIndex) {
        case 0: 
            changeTheme("themeBlue")
            break
        case 1: 
            changeTheme("themeAdwaita")
            break
        case 2: 
            changeTheme("themeAdwaitaDark")
        break
    }
}

const showDialogButton = document.getElementById("showDialogButton")!
const showDialogButton2 = document.getElementById("showDialogButton2")!
const showDialogButton21 = document.getElementById("showDialogButton21")!
const showDialogButton3 = document.getElementById("showDialogButton3")!
const showDialogButton4 = document.getElementById("showDialogButton4")!
const showDialogButton5 = document.getElementById("showDialogButton5")!
const showDialogButton6 = document.getElementById("showDialogButton6")!
const showDialogButton61 = document.getElementById("showDialogButton61")!
const showDialogButton7 = document.getElementById("showDialogButton7")!
const showDialogButton8 = document.getElementById("showDialogButton8")!
const showDialogButton9 = document.getElementById("showDialogButton9")!

showDialogButton.onclick = async () => {
    const res = await dialogBoxComponent.show({
        text: "Standard",
        btnOk: true,
        btnCancel: true
    })    
    console.log("Dialog closed", res)
}

showDialogButton2.onclick = async () => {
    const res = await dialogBoxComponent.show({
        text: "Standard extended",
        btnOk: true,
        btnCancel: true,
        extended: "extended",
        defBtnCancel: true
    })    
    console.log("Dialog closed", res)
}

showDialogButton21.onclick = async () => {
    const res = await dialogBoxComponent.show({
        text: "Standard extended",
        btnOk: true,
        inputText: "The text input",
        btnCancel: true,
        extended: "extended",
        onExtendedResult: res => res.extended = true,
        defBtnCancel: true
    })    
    console.log("Dialog closed", res)
}

showDialogButton3.onclick = async () => {
    const res = await dialogBoxComponent.show({
        text: "Slide",
        slide: true,
        btnOk: true,
        btnCancel: true
    })    
    console.log("Dialog closed", res)
}

showDialogButton4.onclick = async () => {
    const res = await dialogBoxComponent.show({
        text: "Slide reverse",
        slideReverse: true,
        btnOk: true,
        btnCancel: true
    })    
    console.log("Dialog closed", res)
}

showDialogButton5.onclick = async () => {
    const res = await dialogBoxComponent.show({
        text: "3 Knöpfe",
        btnYes: true,
        btnNo: true,
        btnCancel: true
    })    
    console.log("Dialog closed", res)
}

showDialogButton6.onclick = async () => {
    const res = await dialogBoxComponent.show({
        text: "Der Text input:",
        inputText: "The text input",
        btnOk: true,
        btnCancel: true,
        defBtnCancel: true
    })    
    console.log("Dialog closed", res)
}

showDialogButton61.onclick = async () => {
    const res = await dialogBoxComponent.show({
        text: "Datei umbenennen:",
        inputText: "Apocalypse Now.mp4",
        inputSelectRange: [0, 14],
        btnOk: true,
        btnCancel: true,
        defBtnOk: true
    })    
    console.log("Dialog closed", res)
}

showDialogButton7.onclick = async () => {
    const res = await dialogBoxComponent.show({
        text: "Ok nur", 
        btnOk: true
    })    
    console.log("Dialog closed", res)
}

showDialogButton8.onclick = async () => {
    const res = await dialogBoxComponent.show({
        text: "Ja und nein", 
        btnYes: true,
        btnNo: true
    })    
    console.log("Dialog closed", res)
}

showDialogButton9.onclick = async () => {
    const res = await dialogBoxComponent.show({
        text: "Fullscreen dialog",
        btnOk: true,
        fullscreen: true,
        btnCancel: true
    })    
    console.log("Dialog closed", res)
}