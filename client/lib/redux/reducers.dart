import 'package:client/model/app_state.dart';

import 'actions/checkout_action.dart';
import 'actions/product_action.dart';
import 'actions/temp_checkout_action.dart';

AppState reducer(AppState prevState, dynamic action) {
  AppState newState = AppState.fromAppState(prevState);

  if (action is CheckoutAdd) {
    prevState.checkoutList.add(action.payload);
    newState.checkoutList = prevState.checkoutList;
  } else if (action is CheckoutRemove) {
    prevState.checkoutList.removeAt(action.payload);
    newState.checkoutList = prevState.checkoutList;
  } else if (action is CheckoutClear) {
    newState.checkoutList = [];
  } else if (action is ProductAdd) {
    prevState.productList.add(action.payload);
    newState.productList = prevState.productList;
  } else if (action is ProductClear) {
    newState.productList = [];
  }else if (action is TempCheckoutAdd){
    prevState.tempCheckoutList.add(action.payload);
    newState.tempCheckoutList = prevState.tempCheckoutList;
  }else if (action is TempCheckoutClear){
    newState.tempCheckoutList = [];
  }else if (action is TempCheckoutRemove){
    prevState.tempCheckoutList.removeAt(action.payload);
    newState.tempCheckoutList = prevState.tempCheckoutList;
  }

  return newState;
}
