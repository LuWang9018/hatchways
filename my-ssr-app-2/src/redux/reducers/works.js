import uuid from 'uuid';

import { LOAD_WORKS } from '../actionTypes';

const initialState = {
  works: [],
};

export default async function(state = initialState, action) {
  switch (action.type) {
    case LOAD_WORKS: {
      // console.log('works', works);
      // return {
      //   ...state,
      //   works,
      // };
    }
    default:
      return state;
  }
}
