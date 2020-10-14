export interface IAom {
  ariaAtomic: string;
  ariaAutoComplete: string;
  ariaBusy: string;
  ariaChecked: string;
  ariaColCount: string;
  ariaConIndex: string;
  ariaColSpan: string;
  ariaCurrent: string;
  ariaDisabled: string;
  ariaExpanded: string;
  ariaHasPopup: string;
  ariaHidden: string;
  ariaKeyShortcuts: string;
  ariaLabel: string;
  ariaLevel: string;
  ariaLive: string;
  ariaModal: string;
  ariaMultiLine: string;
  ariaMultiSelectable: string;
  ariaOrientation: string;
  ariaPlaceholder: string;
  ariaPosInSet: string;
  ariaPressed: string;
  ariaReadOnly: string;
  ariaRelevant: string;
  ariaRequired: string;
  ariaRoleDescription: string;
  ariaRowCount: string;
  ariaRowIndex: string;
  ariaRowSpan: string;
  ariaSelected: string;
  ariaSort: string;
  ariaValueMax: string;
  ariaValueMin: string;
  ariaValueNow: string;
  ariaValueText: string;
}

export interface IElementInternals extends IAom {
  checkValidity: () => boolean;
  readonly form: HTMLFormElement;
  readonly labels: NodeListOf<HTMLLabelElement>|[];
  readonly reportValidity: () => boolean;
  setFormValue: (value: string) => void;
  setValidity: (validityChanges: Partial<globalThis.ValidityState>, validationMessage?: string) => void;
  validationMessage: string;
  readonly validity: globalThis.ValidityState;
  readonly willValidate: boolean;
}

export interface ICustomElement extends HTMLElement {
  attributeChangedCallback?: (name: string, oldValue: any, newValue: any) => void;
  connectedCallback?: () => void;
  disconnectedCallback?: () => void;
  attachedCallback?: () => void;
  formDisabledCallback?: (isDisabled: boolean) => void;
  formResetCallback?: () => void;
  formAssociatedCallback?: (form: HTMLFormElement) => void;
  disabled?: boolean;
}

export type LabelsList = NodeListOf<HTMLLabelElement>|[];
