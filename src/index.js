import fetch from 'isomorphic-fetch'

const parseResponse = (response) => {
  const contentType = response.headers.get('Content-Type') || ''

  if(contentType.indexOf('json') !== -1) {
    return response.json()
  }else if(contentType.indexOf('text') !== -1) {
    return response.text()
  }

  return response
}

const actionWith = (actionType, payload) => {
  let nextAction;
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
}

export function apiMiddleware({ dispatch, getState }){
  return next => action => {
    const {
      types,
      endPoint,
      options,
      checkStatusFn = function(){},
      deaultMsg = '',
      meta = null,
    } = action

    if (!types) {
      return typeof action === 'function' ?
        action(dispatch, getState) :
        next(action)
    }

    if ( !endPoint ) {
      throw new Error('Expected endPoint to be a url.')
    }

    const { requestType, successType, failureType } = types


    !!requestType && next(actionWith(requestType,response))

    return fetch(endPoint,options).then(parseResponse).then(checkStatusFn).then(
      response => next(actionWith(successType,response)),
      err => {
        if(failureType){
          let msg = err.response && err.response.errmsg || deaultMsg
          return next(actionWith(failureType,{msg:msg,type:'warning'}))
        }
      }
    ).catch(function(err){
      let msg = String(err)
      if(failureType){
        return next(actionWith(failureType,{msg:msg,type:'warning'}))
      }
    })
  }
}
