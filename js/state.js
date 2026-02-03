export const state = {
  data: {},
  character: null,
  inventory: [],
  selectedSlot: 0,
  autosaveEnabled: true,

  // inventory UI
  inventorySearch: "",
  inventorySort: "name",
  inventoryGroup: true,
  browserSelectedIndex: 0,
  selectedWeaponSlot: 0,
  selectedInfo: null,
  infoOpen: false,
  diceLog: [],
  weaponAttachments: {},
  browserStateByKind: {},
};
