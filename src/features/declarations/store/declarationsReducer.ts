import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IDeclarationsState, IDeclaration, ISortable } from '../types';
import { DECLARATIONS_DEFAULT_SORT } from '../constants';

const initialState: IDeclarationsState = {
  declarations: [],
  selectedDeclaration: null,
  listSorting: DECLARATIONS_DEFAULT_SORT,
  isLoading: false,
  hasMore: true,
  total: 0,
  error: null,
};

const declarationsSlice = createSlice({
  name: 'declarations',
  initialState,
  reducers: {
    setDeclarations: (state, action: PayloadAction<IDeclaration[]>) => {
      state.declarations = action.payload;
    },
    appendDeclarations: (state, action: PayloadAction<IDeclaration[]>) => {
      state.declarations = [...state.declarations, ...action.payload];
    },
    setSelectedDeclaration: (state, action: PayloadAction<IDeclaration | null>) => {
      state.selectedDeclaration = action.payload;
    },
    setListSorting: (state, action: PayloadAction<ISortable | undefined>) => {
      state.listSorting = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setHasMore: (state, action: PayloadAction<boolean>) => {
      state.hasMore = action.payload;
    },
    setTotal: (state, action: PayloadAction<number>) => {
      state.total = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    updateDeclarationStatus: (
      state,
      action: PayloadAction<{ id: number; status: number }>
    ) => {
      const { id, status } = action.payload;
      const declaration = state.declarations.find((d) => d.id === id);
      if (declaration) {
        declaration.status = status;
      }
      if (state.selectedDeclaration?.id === id) {
        state.selectedDeclaration.status = status;
      }
    },
    resetDeclarations: (state) => {
      state.declarations = [];
      state.hasMore = true;
      state.total = 0;
      state.error = null;
    },
  },
});

export const {
  setDeclarations,
  appendDeclarations,
  setSelectedDeclaration,
  setListSorting,
  setLoading,
  setHasMore,
  setTotal,
  setError,
  updateDeclarationStatus,
  resetDeclarations,
} = declarationsSlice.actions;

export default declarationsSlice.reducer;
