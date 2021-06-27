import './DialogBoxComponent.js'

const showDialogButton = document.getElementById("showDialogButton")
const dialog = document.querySelector('dialog-box-component')

showDialogButton.onclick = async () => {
    await dialog.show()    
    console.log("Dialog closed")
}