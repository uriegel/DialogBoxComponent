import './DialogBoxComponent.js'

const showDialogButton = document.getElementById("showDialogButton")
const showDialogButton2 = document.getElementById("showDialogButton2")
const showDialogButton3 = document.getElementById("showDialogButton3")
const showDialogButton4 = document.getElementById("showDialogButton4")
const showDialogButton5 = document.getElementById("showDialogButton5")
const showDialogButton6 = document.getElementById("showDialogButton6")
const showDialogButton7 = document.getElementById("showDialogButton7")
const showDialogButton8 = document.getElementById("showDialogButton8")
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
    const res = await dialog.show({
        text: "Standard Cancel",
        btnOk: true,
        btnCancel: true
    })    
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
        btnOk: true,
        btnCancel: true
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