import { LOAD_WORKERS } from '../actionTypes';

const initialState = {
    workers: [],
};

export default function(state = initialState, action) {
    switch (action.type) {
        case LOAD_WORKERS: {
            const works = action.payload;

            return {
                ...state,
                //works: [...state.books, book],
            };
        }
        default:
            return state;
    }
}
