import uuid from 'uuid';

import { LOAD_WORKS } from '../actionTypes';

const initialState = {
  works: [],
};

export default function(state = initialState, action) {
  switch (action.type) {
    case LOAD_WORKS: {
      //const works = action.payload;
      //book.id = uuid();
      return {
        ...state,
        //works: [...state.books, book],
      };
    }
    default:
      return state;
  }
}
