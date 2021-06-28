import './DialogBoxComponent.js'

const showDialogButton = document.getElementById("showDialogButton")
const showDialogButton5 = document.getElementById("showDialogButton5")
const showDialogButton7 = document.getElementById("showDialogButton7")
const dialog = document.querySelector('dialog-box-component')

showDialogButton.onclick = async () => {
    const res = await dialog.show({
        btnOk: true,
        btnCancel: true
    })    
    console.log("Dialog closed", res)
}

showDialogButton5.onclick = async () => {
    const res = await dialog.show({
        btnYes: true,
        btnNo: true,
        btnCancel: true
    })    
    console.log("Dialog closed", res)
}

showDialogButton7.onclick = async () => {
    const res = await dialog.show({
        btnOk: true
    })    
    console.log("Dialog closed", res)
}