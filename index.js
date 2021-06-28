import './DialogBoxComponent.js'

const showDialogButton = document.getElementById("showDialogButton")
const showDialogButton7 = document.getElementById("showDialogButton7")
const dialog = document.querySelector('dialog-box-component')

showDialogButton.onclick = async () => {
    await dialog.show({
        btnOk: true,
        btnCancel: true
    })    
    console.log("Dialog closed")
}

showDialogButton7.onclick = async () => {
    await dialog.show({
        btnOk: true
    })    
    console.log("Dialog closed")
}