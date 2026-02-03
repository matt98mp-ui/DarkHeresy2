import { state } from "./state.js";

const undoStack = [];
const redoStack = [];

export function snapshot() {
  undoStack.push(JSON.stringify(state));
  redoStack.length = 0;
}

export function undo() {
  if (!undoStack.length) return;
  redoStack.push(JSON.stringify(state));
  Object.assign(state, JSON.parse(undoStack.pop()));
}

export function redo() {
  if (!redoStack.length) return;
  undoStack.push(JSON.stringify(state));
  Object.assign(state, JSON.parse(redoStack.pop()));
}


export function canUndo() { return undoStack.length > 0; }
export function canRedo() { return redoStack.length > 0; }
