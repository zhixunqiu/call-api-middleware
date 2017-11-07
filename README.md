# call-api-middleware

### Installation
```
npm install --save call-api-middleware
```
 Then,to enable Redux MIddleware,use [`applyMiddleware()`](http://rackt.github.io/redux/docs/api/applyMiddleware.html):

```js
import { createStore, applyMiddleware } from 'redux';
import apiMiddleware from 'call-api-middleware';
import rootReducer from './reducers/index';

// create a store that has call-api-middleware middleware enabled
const createStoreWithMiddleware = applyMiddleware(
  apiMiddleware
)(createStore);

const store = createStoreWithMiddleware(rootReducer);
```
