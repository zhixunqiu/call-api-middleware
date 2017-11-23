# call-api-middleware

### Installation
```
npm install --save call-api-middleware
```
### Options
  1.types:it can be a action type,or action create function.

      requestType: before request,it is optional
      successType: request success,it is necessary.
      failureType: request fail,it is optional.
  2.endPoint : request url

  3.options : request option

  4.checkStatusFn : A function to check your respond result,it is optional.

  5.deaultMsg : A default message for error status.

  6.failCallback : A function, you can deal the status of error responses,it is optional.
### How to use
  First,to enable Redux MIddleware,use [`applyMiddleware()`](http://rackt.github.io/redux/docs/api/applyMiddleware.html):

```
import { createStore, applyMiddleware } from 'redux';
import apiMiddleware from 'call-api-middleware';
import rootReducer from './reducers/index';

// create a store that has call-api-middleware middleware enabled
const createStoreWithMiddleware = applyMiddleware(
  apiMiddleware
)(createStore);

const store = createStoreWithMiddleware(rootReducer);
```
    Then,you can add network request in your action files like this:
```
export function rulelist(type){
  let url = `${BASEURL}rule/rulelist`

  return {
    types: {successType:_rulelist,failureType:alertShow},
    endPoint: url,
    options: {credentials: 'include'},
    checkStatusFn: checkStatus,
    deaultMsg: "获取用车权限列表接口出错",
  }
}
```

