export declare enum Result {
    Ok = 0,
    Yes = 1,
    No = 2,
    Cancel = 3
}
export declare type DialogResult = {
    result: Result;
    input: string | undefined;
};
export declare type Settings = {
    btnOk?: boolean;
    btnYes?: boolean;
    btnNo?: boolean;
    btnCancel?: boolean;
    defBtnOk?: boolean;
    defBtnYes?: boolean;
    defBtnNo?: boolean;
    defBtnCancel?: boolean;
    text?: string;
    extended?: string;
    inputText?: string | undefined;
    inputSelectRange?: number[];
    onExtendedResult?: (result: any) => void;
    fullscreen?: boolean;
    slide?: boolean;
    slideReverse?: boolean;
};
export declare class DialogBox extends HTMLElement {
    private dialogroot;
    private dialogContainer;
    private fader;
    private dialog;
    private text;
    private input;
    private btnOk;
    private btnYes;
    private btnNo;
    private btnCancel;
    private defBtn;
    private extendedContent;
    private resolveDialog?;
    private focusIndex;
    private cancel;
    private no;
    private focusables;
    private inputSelectRange?;
    private slide;
    private slideReverse;
    private buttonHasFocus;
    private extendedFocusables;
    private onExtendedResult;
    constructor();
    connectedCallback(): void;
    show(settings: Settings): Promise<DialogResult>;
    onKeydown(evt: KeyboardEvent): void;
    closeDialog(result: Result): void;
    focusButton(focus: boolean): void;
}
