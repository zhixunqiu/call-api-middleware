'use strict';

exports.__esModule = true;
exports.apiMiddleware = apiMiddleware;

var _isomorphicFetch = require('isomorphic-fetch');

var _isomorphicFetch2 = _interopRequireDefault(_isomorphicFetch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var parseResponse = function parseResponse(response) {
  var contentType = response.headers.get('Content-Type') || '';

  if (contentType.indexOf('json') !== -1) {
    return response.json();
  } else if (contentType.indexOf('text') !== -1) {
    return response.text();
  }

  return response;
};

var actionWith = function actionWith(actionType, payload) {
  var nextAction = void 0;
  if (typeof actionType === 'function') {
    nextAction = actionType(payload);
  } else {
    // convert strings or symbols to FSA object
    if (typeof actionType === 'string' || typeof actionType === 'symbol') {
      nextAction = { type: actionType };
    } else {
      nextAction = actionType;
    }

    if (payload) {
      nextAction.payload = payload;
    }
  }
  if (payload instanceof Error) {
    nextAction.error = true;
  }

  return nextAction;
};

function apiMiddleware(_ref) {
  var dispatch = _ref.dispatch,
      getState = _ref.getState;

  return function (next) {
    return function (action) {
      var types = action.types,
          endPoint = action.endPoint,
          options = action.options,
          _action$checkStatusFn = action.checkStatusFn,
          checkStatusFn = _action$checkStatusFn === undefined ? function () {} : _action$checkStatusFn,
          _action$deaultMsg = action.deaultMsg,
          deaultMsg = _action$deaultMsg === undefined ? '' : _action$deaultMsg,
          _action$failCallback = action.failCallback,
          failCallback = _action$failCallback === undefined ? null : _action$failCallback;


      if (!types) {
        return typeof action === 'function' ? action(dispatch, getState) : next(action);
      }

      if (!endPoint) {
        throw new Error('Expected endPoint to be a url.');
      }

      var requestType = types.requestType,
          successType = types.successType,
          failureType = types.failureType;


      !!requestType && next(actionWith(requestType));

      return (0, _isomorphicFetch2['default'])(endPoint, options).then(parseResponse).then(function (response) {
        return checkStatusFn(response, dispatch);
      }).then(function (response) {
        return next(actionWith(successType, response));
      }, function (err) {
        if (failureType) {
          var msg = err.response && err.response.errmsg || deaultMsg;
          return next(actionWith(failureType, { msg: msg, type: 'warning' }));
        }
        if (failCallback) {
          failCallback(next, err, deaultMsg);
        }
      })['catch'](function (err) {
        var msg = String(err);
        if (failureType) {
          return next(actionWith(failureType, { msg: msg, type: 'warning' }));
        }
        if (failCallback) {
          failCallback(next, err, deaultMsg);
        }
      });
    };
  };
}