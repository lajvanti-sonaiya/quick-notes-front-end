export const addNoteToState = (state, notes) => {
  const index = state?.notes?.findIndex((note) => note._id == notes._id);

  if (index === -1) {
    state.notes = [notes, ...state.notes];
    state.total += 1;
  }

  state.notes.sort((a, b) => {
    if (a.isPinned === b.isPinned) {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    return b.isPinned - a.isPinned;
  });
};

export const updateNoteToState = (state, notes) => {
  const index = state.notes.findIndex((note) => note._id === notes._id);
  if (index !== -1) {
    state.notes[index] = notes;
  }

  state.notes.sort((a, b) => {
    if (a.isPinned === b.isPinned) {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    return b.isPinned - a.isPinned;
  });
};

export const deleteNoteFormState = (state, notes) => {
  const initialLength = state.notes.length;

  state.notes = state?.notes?.filter((note) => note._id !== notes._id);
  // state.total -= 1;
  if (state.notes.length < initialLength) {
    state.total -= 1;
  }
};
