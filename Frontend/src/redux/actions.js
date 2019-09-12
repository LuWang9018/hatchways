import { LOAD_WORKS, LOAD_WORKERS } from './actionTypes';

export const loadWorks = works => ({
  type: LOAD_WORKS,
  payload: works,
});

export const loadWorkers = workers => ({
  type: LOAD_WORKERS,
  payload: workers,
});
