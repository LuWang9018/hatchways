import uuid from 'uuid';

import { LOAD_WORKS } from '../actionTypes';
import { callApi } from '../../modules/utils';

const initialState = {
  works: [],
};

export default async function(state = initialState, action) {
  switch (action.type) {
    case LOAD_WORKS: {
      const works = await callApi(
        'https://www.hatchways.io/api/assessment/work_orders',
        'GET'
      );

      console.log('works', works);
      return {
        ...state,
        works,
      };
    }
    default:
      return state;
  }
}
