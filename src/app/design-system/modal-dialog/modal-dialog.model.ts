export enum DsModalDialogSize {
  FullScreen = "full-screen",
  Large = "large",
  Medium = "medium",
  Small = "small",
}

export enum DsModalDialogAlignment {
  Left = "left",
  Center = "center",
  Right = "right",
}

export const DS_MODAL_DIALOG_SIZES: readonly DsModalDialogSize[] = [
  DsModalDialogSize.FullScreen,
  DsModalDialogSize.Large,
  DsModalDialogSize.Medium,
  DsModalDialogSize.Small,
] as const;

export const DS_MODAL_DIALOG_ALIGNMENTS: readonly DsModalDialogAlignment[] = [
  DsModalDialogAlignment.Left,
  DsModalDialogAlignment.Center,
  DsModalDialogAlignment.Right,
] as const;
