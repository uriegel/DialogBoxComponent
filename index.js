import './DialogBoxComponent.js'

const dialogBoxComponent = document.getElementById('dialogBoxComponent')
const themeChooser = document.getElementById("themeChooser")
const extended = document.getElementById("extended")
themeChooser.onchange = () => {
    const changeTheme = theme => {
        ["themeBlue", "themeAdwaita", "themeAdwaitaDark"].forEach(n => {
            document.body.classList.remove(n)    
            dialogBoxComponent.classList.remove(n)    
        })
        document.body.classList.add(theme)    
        dialogBoxComponent.classList.add(theme)        
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

const showDialogButton = document.getElementById("showDialogButton")
const showDialogButton2 = document.getElementById("showDialogButton2")
const showDialogButton21 = document.getElementById("showDialogButton21")
const showDialogButton3 = document.getElementById("showDialogButton3")
const showDialogButton4 = document.getElementById("showDialogButton4")
const showDialogButton5 = document.getElementById("showDialogButton5")
const showDialogButton6 = document.getElementById("showDialogButton6")
const showDialogButton7 = document.getElementById("showDialogButton7")
const showDialogButton8 = document.getElementById("showDialogButton8")
const chkbx1 = document.getElementById("chkbx1")
const chkbx2 = document.getElementById("chkbx2")
const chkbx3 = document.getElementById("chkbx3")
const extendedFocusables = [chkbx1, chkbx2, chkbx3]
const dialog = document.querySelector('dialog-box-component')

showDialogButton.onclick = async () => {
    const res = await dialog.show({
        text: "Standard",
        btnOk: true,
        btnCancel: true
    })    
    console.log("Dialog closed", res)
}

showDialogButton2.onclick = async () => {
    extended.classList.remove("none")
    const res = await dialog.show({
        text: "Standard extended",
        btnOk: true,
        btnCancel: true,
        extendedFocusables,
        defBtnCancel: true
    })    
    extended.classList.add("none")
    console.log("Dialog closed", res)
}

showDialogButton21.onclick = async () => {
    extended.classList.remove("none")
    const res = await dialog.show({
        text: "Standard extended",
        btnOk: true,
        input: true,
        inputText: "The text input",
        btnCancel: true,
        extendedFocusables,
        onExtendedResult: res => res.extended = true,
        defBtnCancel: true
    })    
    extended.classList.add("none")
    console.log("Dialog closed", res)
}

showDialogButton3.onclick = async () => {
    const res = await dialog.show({
        text: "Slide left",
        btnOk: true,
        btnCancel: true
    })    
    console.log("Dialog closed", res)
}

showDialogButton4.onclick = async () => {
    const res = await dialog.show({
        text: "Slide right",
        btnOk: true,
        btnCancel: true
    })    
    console.log("Dialog closed", res)
}

showDialogButton5.onclick = async () => {
    const res = await dialog.show({
        text: "3 Knöpfe",
        btnYes: true,
        btnNo: true,
        btnCancel: true
    })    
    console.log("Dialog closed", res)
}

showDialogButton6.onclick = async () => {
    const res = await dialog.show({
        text: "Der Text input:",
        input: true,
        inputText: "The text input",
        btnOk: true,
        btnCancel: true,
        defBtnCancel: true
    })    
    console.log("Dialog closed", res)
}

showDialogButton7.onclick = async () => {
    const res = await dialog.show({
        text: "Ok nur", 
        btnOk: true
    })    
    console.log("Dialog closed", res)
}

showDialogButton8.onclick = async () => {
    const res = await dialog.show({
        text: "Ja und nein", 
        btnYes: true,
        btnNo: true
    })    
    console.log("Dialog closed", res)
}