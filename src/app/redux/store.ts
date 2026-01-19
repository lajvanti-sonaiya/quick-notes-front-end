import { configureStore } from '@reduxjs/toolkit'
import  noteSlice  from './slices/note-slice'

export const store = configureStore({
  reducer: {
    note:noteSlice
  },
})