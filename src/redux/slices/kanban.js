import keyBy from 'lodash/keyBy';
import { createSlice } from '@reduxjs/toolkit';
import omit from 'lodash/omit';
// utils
import axios from '../../utils/axios';

// ----------------------------------------------------------------------

const initialState = {
  isLoading: false,
  error: null,
  board: {
    cards: {},
    columns: {
      mapped: {
        id: 'mapped',
        name: 'Mapped column',
        // cardIds: ["colA","colB","colC"],
        cardIds: [],
      },
      customerDB: {
        id: 'customerDB',
        name: 'Customer Database',
        // cardIds: ["colD","colE"],
        cardIds: [],
      },
 
    },
    columnOrder: [],
  },
};

const slice = createSlice({
  name: 'kanban',
  initialState,
  reducers: {
    // START LOADING
    startLoading(state) {
      state.isLoading = true;
    },

    // HAS ERROR
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    // GET BOARD
    getBoardSuccess(state, action) {
      state.isLoading = false;
      const board = action.payload;
      const cards = keyBy(board.cards, 'id');
      const columns = keyBy(board.columns, 'id');
      const { columnOrder } = board;

      state.board = {
        cards,
        columns,
        columnOrder,
      };
    },

    // CREATE NEW COLUMN
    createColumnSuccess(state, action) {
      const newColumn = action.payload;
      state.isLoading = false;
      state.board.columns = {
        ...state.board.columns,
        [newColumn.id]: newColumn,
      };
      state.board.columnOrder.push(newColumn.id);
    },

    persistCard(state, action) {
      const columns = action.payload;
      state.board.columns = columns;
    },

    persistColumn(state, action) {
      state.board.columnOrder = action.payload;
    },

    addTask(state, action) {
      const { card, columnId } = action.payload;

      state.board.cards[card.id] = card;
      state.board.columns[columnId].cardIds.push(card.id);
    },

    deleteTask(state, action) {
      const { cardId, columnId } = action.payload;

      state.board.columns[columnId].cardIds = state.board.columns[columnId].cardIds.filter(
        (id) => id !== cardId
      );

      state.board.cards = omit(state.board.cards, [cardId]);
    },

    // UPDATE COLUMN
    updateColumnSuccess(state, action) {
      const column = action.payload;

      state.isLoading = false;
      state.board.columns[column.id] = column;
    },

    // DELETE COLUMN
    deleteColumnSuccess(state, action) {
      const { columnId } = action.payload;
      const deletedColumn = state.board.columns[columnId];

      state.isLoading = false;
      state.board.columns = omit(state.board.columns, [columnId]);
      state.board.cards = omit(state.board.cards, [...deletedColumn.cardIds]);
      state.board.columnOrder = state.board.columnOrder.filter((c) => c !== columnId);
    },
  },
});

// Reducer
export default slice.reducer;

export const { actions } = slice;

// ----------------------------------------------------------------------

export function getBoard(currentSelection) {
  console.log(currentSelection)
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.get('/api/kanban/board');
      const tempobj = {}
      
      currentSelection.columnNames.forEach((item,key)=>{
        const temp = {id:item.COLUMN_NAME,name:item.COLUMN_NAME,attachments:[]}
        tempobj[item.COLUMN_NAME]=temp;
      }) 
      const thisNewObj = {...tempobj}
      console.log(thisNewObj)

      const selected = currentSelection.selectedColumns.map(item=>item.name)
      console.log(selected)
      const unselected = currentSelection.columnNames.map(item=>item.COLUMN_NAME)
      console.log(unselected)
      dispatch(
        slice.actions.getBoardSuccess({
          cards:thisNewObj,
          columns: {
            mapped: {
              id: 'mapped',
              name: 'Mapped column',
              // cardIds: ["colA","colB","colC"],
              cardIds: [],
            },
            customerDB: {
              id: 'customerDB',
              name: 'Customer Database',
              // cardIds: ["colD","colE"],
              cardIds: unselected,
            },
       
          },
          columnOrder: [
            'mapped',
            'customerDB',
          ],
        })
      );
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function createColumn(newColumn) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('/api/kanban/columns/new', newColumn);
      dispatch(slice.actions.createColumnSuccess(response.data.column));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function updateColumn(columnId, column) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      const response = await axios.post('/api/kanban/columns/update', {
        columnId,
        column,
      });
      dispatch(slice.actions.updateColumnSuccess(response.data.column));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function deleteColumn(columnId) {
  return async (dispatch) => {
    dispatch(slice.actions.startLoading());
    try {
      await axios.post('/api/kanban/columns/delete', { columnId });
      dispatch(slice.actions.deleteColumnSuccess({ columnId }));
    } catch (error) {
      dispatch(slice.actions.hasError(error));
    }
  };
}

// ----------------------------------------------------------------------

export function persistColumn(newColumnOrder) {
  return (dispatch) => {
    dispatch(slice.actions.persistColumn(newColumnOrder));
  };
}

// ----------------------------------------------------------------------

export function persistCard(columns) {
  return (dispatch) => {
    dispatch(slice.actions.persistCard(columns));
  };
}

// ----------------------------------------------------------------------

export function addTask({ card, columnId }) {
  return (dispatch) => {
    dispatch(slice.actions.addTask({ card, columnId }));
  };
}

// ----------------------------------------------------------------------

export function deleteTask({ cardId, columnId }) {
  return (dispatch) => {
    dispatch(slice.actions.deleteTask({ cardId, columnId }));
  };
}
