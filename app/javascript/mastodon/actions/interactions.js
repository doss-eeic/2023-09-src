import api, { getLinks } from '../api';

import { fetchRelationships } from './accounts';
import { importFetchedAccounts, importFetchedStatus } from './importer';

export const REBLOG_REQUEST = 'REBLOG_REQUEST';
export const REBLOG_SUCCESS = 'REBLOG_SUCCESS';
export const REBLOG_FAIL    = 'REBLOG_FAIL';

export const REBLOGS_EXPAND_REQUEST = 'REBLOGS_EXPAND_REQUEST';
export const REBLOGS_EXPAND_SUCCESS = 'REBLOGS_EXPAND_SUCCESS';
export const REBLOGS_EXPAND_FAIL = 'REBLOGS_EXPAND_FAIL';

export const FAVOURITE_REQUEST = 'FAVOURITE_REQUEST';
export const FAVOURITE_SUCCESS = 'FAVOURITE_SUCCESS';
export const FAVOURITE_FAIL    = 'FAVOURITE_FAIL';

export const THUMBSUP_REQUEST = 'THUMBSUP_REQUEST';
export const THUMBSUP_SUCCESS = 'THUMBSUP_SUCCESS';
export const THUMBSUP_FAIL    = 'THUMBSUP_FAIL';

export const THUMBSDOWN_REQUEST = 'THUMBSDOWN_REQUEST';
export const THUMBSDOWN_SUCCESS = 'THUMBSDOWN_SUCCESS';
export const THUMBSDOWN_FAIL    = 'THUMBSDOWN_FAIL';

export const UNREBLOG_REQUEST = 'UNREBLOG_REQUEST';
export const UNREBLOG_SUCCESS = 'UNREBLOG_SUCCESS';
export const UNREBLOG_FAIL    = 'UNREBLOG_FAIL';

export const UNFAVOURITE_REQUEST = 'UNFAVOURITE_REQUEST';
export const UNFAVOURITE_SUCCESS = 'UNFAVOURITE_SUCCESS';
export const UNFAVOURITE_FAIL    = 'UNFAVOURITE_FAIL';

export const UNTHUMBSUP_REQUEST = 'UNTHUMBSUP_REQUEST';
export const UNTHUMBSUP_SUCCESS = 'UNTHUMBSUP_SUCCESS';
export const UNTHUMBSUP_FAIL    = 'UNTHUMBSUP_FAIL';

export const UNTHUMBSDOWN_REQUEST = 'UNTHUMBSDOWN_REQUEST';
export const UNTHUMBSDOWN_SUCCESS = 'UNTHUMBSDOWN_SUCCESS';
export const UNTHUMBSDOWN_FAIL    = 'UNTHUMBSDOWN_FAIL';

export const REBLOGS_FETCH_REQUEST = 'REBLOGS_FETCH_REQUEST';
export const REBLOGS_FETCH_SUCCESS = 'REBLOGS_FETCH_SUCCESS';
export const REBLOGS_FETCH_FAIL    = 'REBLOGS_FETCH_FAIL';

export const FAVOURITES_FETCH_REQUEST = 'FAVOURITES_FETCH_REQUEST';
export const FAVOURITES_FETCH_SUCCESS = 'FAVOURITES_FETCH_SUCCESS';
export const FAVOURITES_FETCH_FAIL    = 'FAVOURITES_FETCH_FAIL';

export const FAVOURITES_EXPAND_REQUEST = 'FAVOURITES_EXPAND_REQUEST';
export const FAVOURITES_EXPAND_SUCCESS = 'FAVOURITES_EXPAND_SUCCESS';
export const FAVOURITES_EXPAND_FAIL = 'FAVOURITES_EXPAND_FAIL';

export const PIN_REQUEST = 'PIN_REQUEST';
export const PIN_SUCCESS = 'PIN_SUCCESS';
export const PIN_FAIL    = 'PIN_FAIL';

export const UNPIN_REQUEST = 'UNPIN_REQUEST';
export const UNPIN_SUCCESS = 'UNPIN_SUCCESS';
export const UNPIN_FAIL    = 'UNPIN_FAIL';

export const BOOKMARK_REQUEST = 'BOOKMARK_REQUEST';
export const BOOKMARK_SUCCESS = 'BOOKMARKED_SUCCESS';
export const BOOKMARK_FAIL    = 'BOOKMARKED_FAIL';

export const UNBOOKMARK_REQUEST = 'UNBOOKMARKED_REQUEST';
export const UNBOOKMARK_SUCCESS = 'UNBOOKMARKED_SUCCESS';
export const UNBOOKMARK_FAIL    = 'UNBOOKMARKED_FAIL';

export function reblog(status, visibility) {
  return function (dispatch, getState) {
    dispatch(reblogRequest(status));

    api(getState).post(`/api/v1/statuses/${status.get('id')}/reblog`, { visibility }).then(function (response) {
      // The reblog API method returns a new status wrapped around the original. In this case we are only
      // interested in how the original is modified, hence passing it skipping the wrapper
      dispatch(importFetchedStatus(response.data.reblog));
      dispatch(reblogSuccess(status));
    }).catch(function (error) {
      dispatch(reblogFail(status, error));
    });
  };
}

export function unreblog(status) {
  return (dispatch, getState) => {
    dispatch(unreblogRequest(status));

    api(getState).post(`/api/v1/statuses/${status.get('id')}/unreblog`).then(response => {
      dispatch(importFetchedStatus(response.data));
      dispatch(unreblogSuccess(status));
    }).catch(error => {
      dispatch(unreblogFail(status, error));
    });
  };
}

export function reblogRequest(status) {
  return {
    type: REBLOG_REQUEST,
    status: status,
    skipLoading: true,
  };
}

export function reblogSuccess(status) {
  return {
    type: REBLOG_SUCCESS,
    status: status,
    skipLoading: true,
  };
}

export function reblogFail(status, error) {
  return {
    type: REBLOG_FAIL,
    status: status,
    error: error,
    skipLoading: true,
  };
}

export function unreblogRequest(status) {
  return {
    type: UNREBLOG_REQUEST,
    status: status,
    skipLoading: true,
  };
}

export function unreblogSuccess(status) {
  return {
    type: UNREBLOG_SUCCESS,
    status: status,
    skipLoading: true,
  };
}

export function unreblogFail(status, error) {
  return {
    type: UNREBLOG_FAIL,
    status: status,
    error: error,
    skipLoading: true,
  };
}

export function favourite(status) {
  return function (dispatch, getState) {
    dispatch(favouriteRequest(status));

    api(getState).post(`/api/v1/statuses/${status.get('id')}/favourite`).then(function (response) {
      dispatch(importFetchedStatus(response.data));
      dispatch(favouriteSuccess(status));
    }).catch(function (error) {
      dispatch(favouriteFail(status, error));
    });
  };
}

export function unfavourite(status) {
  return (dispatch, getState) => {
    dispatch(unfavouriteRequest(status));

    api(getState).post(`/api/v1/statuses/${status.get('id')}/unfavourite`).then(response => {
      dispatch(importFetchedStatus(response.data));
      dispatch(unfavouriteSuccess(status));
    }).catch(error => {
      dispatch(unfavouriteFail(status, error));
    });
  };
}

export function thumbsup(status) {
  return function (dispatch, getState) {
    dispatch(thumbsupRequest(status));

    api(getState).post(`/api/v1/statuses/${status.get('id')}/thumbsup`).then(function (response) {
      dispatch(importFetchedStatus(response.data));
      dispatch(thumbsupSuccess(status));
    }).catch(function (error) {
      dispatch(thumbsupFail(status, error));
    });
  };
}

export function unthumbsup(status) {
  return (dispatch, getState) => {
    dispatch(unthumbsupRequest(status));

    api(getState).post(`/api/v1/statuses/${status.get('id')}/unthumbsup`).then(response => {
      dispatch(importFetchedStatus(response.data));
      dispatch(unthumbsupSuccess(status));
    }).catch(error => {
      dispatch(unthumbsupFail(status, error));
    });
  };
}

export function thumbsdown(status) {
  return function (dispatch, getState) {
    dispatch(thumbsdownRequest(status));

    api(getState).post(`/api/v1/statuses/${status.get('id')}/thumbsdown`).then(function (response) {
      dispatch(importFetchedStatus(response.data));
      dispatch(thumbsdownSuccess(status));
    }).catch(function (error) {
      dispatch(thumbsdownFail(status, error));
    });
  };
}

export function unthumbsdown(status) {
  return (dispatch, getState) => {
    dispatch(unthumbsdownRequest(status));

    api(getState).post(`/api/v1/statuses/${status.get('id')}/unthumbsdown`).then(response => {
      dispatch(importFetchedStatus(response.data));
      dispatch(unthumbsdownSuccess(status));
    }).catch(error => {
      dispatch(unthumbsdownFail(status, error));
    });
  };
}

export function favouriteRequest(status) {
  return {
    type: FAVOURITE_REQUEST,
    status: status,
    skipLoading: true,
  };
}

export function favouriteSuccess(status) {
  return {
    type: FAVOURITE_SUCCESS,
    status: status,
    skipLoading: true,
  };
}

export function favouriteFail(status, error) {
  return {
    type: FAVOURITE_FAIL,
    status: status,
    error: error,
    skipLoading: true,
  };
}

export function unfavouriteRequest(status) {
  return {
    type: UNFAVOURITE_REQUEST,
    status: status,
    skipLoading: true,
  };
}


export function unfavouriteSuccess(status) {
  return {
    type: UNFAVOURITE_SUCCESS,
    status: status,
    skipLoading: true,
  };
}

export function unfavouriteFail(status, error) {
  return {
    type: UNFAVOURITE_FAIL,
    status: status,
    error: error,
    skipLoading: true,
  };
}

export function thumbsupRequest(status) {
  return {
    type: THUMBSUP_REQUEST,
    status: status,
    skipLoading: true,
  };
}

export function thumbsupSuccess(status) {
  return {
    type: THUMBSUP_SUCCESS,
    status: status,
    skipLoading: true,
  };
}

export function thumbsupFail(status, error) {
  return {
    type: THUMBSUP_FAIL,
    status: status,
    error: error,
    skipLoading: true,
  };
}

export function unthumbsupRequest(status) {
  return {
    type: UNTHUMBSUP_REQUEST,
    status: status,
    skipLoading: true,
  };
}

export function unthumbsupSuccess(status) {
  return {
    type: UNTHUMBSUP_SUCCESS,
    status: status,
    skipLoading: true,
  };
}

export function unthumbsupFail(status, error) {
  return {
    type: UNTHUMBSUP_FAIL,
    status: status,
    error: error,
    skipLoading: true,
  };
}

export function thumbsdownRequest(status) {
  return {
    type: THUMBSDOWN_REQUEST,
    status: status,
    skipLoading: true,
  };
}

export function thumbsdownSuccess(status) {
  return {
    type: THUMBSDOWN_SUCCESS,
    status: status,
    skipLoading: true,
  };
}

export function thumbsdownFail(status, error) {
  return {
    type: THUMBSDOWN_FAIL,
    status: status,
    error: error,
    skipLoading: true,
  };
}

export function unthumbsdownRequest(status) {
  return {
    type: UNTHUMBSDOWN_REQUEST,
    status: status,
    skipLoading: true,
  };
}

export function unthumbsdownSuccess(status) {
  return {
    type: UNTHUMBSDOWN_SUCCESS,
    status: status,
    skipLoading: true,
  };
}

export function unthumbsdownFail(status, error) {
  return {
    type: UNTHUMBSDOWN_FAIL,
    status: status,
    error: error,
    skipLoading: true,
  };
}

export function bookmark(status) {
  return function (dispatch, getState) {
    dispatch(bookmarkRequest(status));

    api(getState).post(`/api/v1/statuses/${status.get('id')}/bookmark`).then(function (response) {
      dispatch(importFetchedStatus(response.data));
      dispatch(bookmarkSuccess(status, response.data));
    }).catch(function (error) {
      dispatch(bookmarkFail(status, error));
    });
  };
}

export function unbookmark(status) {
  return (dispatch, getState) => {
    dispatch(unbookmarkRequest(status));

    api(getState).post(`/api/v1/statuses/${status.get('id')}/unbookmark`).then(response => {
      dispatch(importFetchedStatus(response.data));
      dispatch(unbookmarkSuccess(status, response.data));
    }).catch(error => {
      dispatch(unbookmarkFail(status, error));
    });
  };
}

export function bookmarkRequest(status) {
  return {
    type: BOOKMARK_REQUEST,
    status: status,
  };
}

export function bookmarkSuccess(status, response) {
  return {
    type: BOOKMARK_SUCCESS,
    status: status,
    response: response,
  };
}

export function bookmarkFail(status, error) {
  return {
    type: BOOKMARK_FAIL,
    status: status,
    error: error,
  };
}

export function unbookmarkRequest(status) {
  return {
    type: UNBOOKMARK_REQUEST,
    status: status,
  };
}

export function unbookmarkSuccess(status, response) {
  return {
    type: UNBOOKMARK_SUCCESS,
    status: status,
    response: response,
  };
}

export function unbookmarkFail(status, error) {
  return {
    type: UNBOOKMARK_FAIL,
    status: status,
    error: error,
  };
}

export function fetchReblogs(id) {
  return (dispatch, getState) => {
    dispatch(fetchReblogsRequest(id));

    api(getState).get(`/api/v1/statuses/${id}/reblogged_by`).then(response => {
      const next = getLinks(response).refs.find(link => link.rel === 'next');
      dispatch(importFetchedAccounts(response.data));
      dispatch(fetchReblogsSuccess(id, response.data, next ? next.uri : null));
      dispatch(fetchRelationships(response.data.map(item => item.id)));
    }).catch(error => {
      dispatch(fetchReblogsFail(id, error));
    });
  };
}

export function fetchReblogsRequest(id) {
  return {
    type: REBLOGS_FETCH_REQUEST,
    id,
  };
}

export function fetchReblogsSuccess(id, accounts, next) {
  return {
    type: REBLOGS_FETCH_SUCCESS,
    id,
    accounts,
    next,
  };
}

export function fetchReblogsFail(id, error) {
  return {
    type: REBLOGS_FETCH_FAIL,
    id,
    error,
  };
}

export function expandReblogs(id) {
  return (dispatch, getState) => {
    const url = getState().getIn(['user_lists', 'reblogged_by', id, 'next']);
    if (url === null) {
      return;
    }

    dispatch(expandReblogsRequest(id));

    api(getState).get(url).then(response => {
      const next = getLinks(response).refs.find(link => link.rel === 'next');

      dispatch(importFetchedAccounts(response.data));
      dispatch(expandReblogsSuccess(id, response.data, next ? next.uri : null));
      dispatch(fetchRelationships(response.data.map(item => item.id)));
    }).catch(error => dispatch(expandReblogsFail(id, error)));
  };
}

export function expandReblogsRequest(id) {
  return {
    type: REBLOGS_EXPAND_REQUEST,
    id,
  };
}

export function expandReblogsSuccess(id, accounts, next) {
  return {
    type: REBLOGS_EXPAND_SUCCESS,
    id,
    accounts,
    next,
  };
}

export function expandReblogsFail(id, error) {
  return {
    type: REBLOGS_EXPAND_FAIL,
    id,
    error,
  };
}

export function fetchFavourites(id) {
  return (dispatch, getState) => {
    dispatch(fetchFavouritesRequest(id));

    api(getState).get(`/api/v1/statuses/${id}/favourited_by`).then(response => {
      const next = getLinks(response).refs.find(link => link.rel === 'next');
      dispatch(importFetchedAccounts(response.data));
      dispatch(fetchFavouritesSuccess(id, response.data, next ? next.uri : null));
      dispatch(fetchRelationships(response.data.map(item => item.id)));
    }).catch(error => {
      dispatch(fetchFavouritesFail(id, error));
    });
  };
}

export function fetchFavouritesRequest(id) {
  return {
    type: FAVOURITES_FETCH_REQUEST,
    id,
  };
}

export function fetchFavouritesSuccess(id, accounts, next) {
  return {
    type: FAVOURITES_FETCH_SUCCESS,
    id,
    accounts,
    next,
  };
}

export function fetchFavouritesFail(id, error) {
  return {
    type: FAVOURITES_FETCH_FAIL,
    id,
    error,
  };
}

export function expandFavourites(id) {
  return (dispatch, getState) => {
    const url = getState().getIn(['user_lists', 'favourited_by', id, 'next']);
    if (url === null) {
      return;
    }

    dispatch(expandFavouritesRequest(id));

    api(getState).get(url).then(response => {
      const next = getLinks(response).refs.find(link => link.rel === 'next');

      dispatch(importFetchedAccounts(response.data));
      dispatch(expandFavouritesSuccess(id, response.data, next ? next.uri : null));
      dispatch(fetchRelationships(response.data.map(item => item.id)));
    }).catch(error => dispatch(expandFavouritesFail(id, error)));
  };
}

export function expandFavouritesRequest(id) {
  return {
    type: FAVOURITES_EXPAND_REQUEST,
    id,
  };
}

export function expandFavouritesSuccess(id, accounts, next) {
  return {
    type: FAVOURITES_EXPAND_SUCCESS,
    id,
    accounts,
    next,
  };
}

export function expandFavouritesFail(id, error) {
  return {
    type: FAVOURITES_EXPAND_FAIL,
    id,
    error,
  };
}

export function pin(status) {
  return (dispatch, getState) => {
    dispatch(pinRequest(status));

    api(getState).post(`/api/v1/statuses/${status.get('id')}/pin`).then(response => {
      dispatch(importFetchedStatus(response.data));
      dispatch(pinSuccess(status));
    }).catch(error => {
      dispatch(pinFail(status, error));
    });
  };
}

export function pinRequest(status) {
  return {
    type: PIN_REQUEST,
    status,
    skipLoading: true,
  };
}

export function pinSuccess(status) {
  return {
    type: PIN_SUCCESS,
    status,
    skipLoading: true,
  };
}

export function pinFail(status, error) {
  return {
    type: PIN_FAIL,
    status,
    error,
    skipLoading: true,
  };
}

export function unpin (status) {
  return (dispatch, getState) => {
    dispatch(unpinRequest(status));

    api(getState).post(`/api/v1/statuses/${status.get('id')}/unpin`).then(response => {
      dispatch(importFetchedStatus(response.data));
      dispatch(unpinSuccess(status));
    }).catch(error => {
      dispatch(unpinFail(status, error));
    });
  };
}

export function unpinRequest(status) {
  return {
    type: UNPIN_REQUEST,
    status,
    skipLoading: true,
  };
}

export function unpinSuccess(status) {
  return {
    type: UNPIN_SUCCESS,
    status,
    skipLoading: true,
  };
}

export function unpinFail(status, error) {
  return {
    type: UNPIN_FAIL,
    status,
    error,
    skipLoading: true,
  };
}
