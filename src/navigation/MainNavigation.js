import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from '../screens/auth/Login';
import Register from '../screens/auth/Register';
import BottomBarNavigation from '../navigation/BottomNavigation';
import TopNavigation from './TopNavigation';
import Cart from '../screens/Cart/Cart';
import Payment from '../screens/Payment/Payment';
import IndividualOrder from '../screens/Order/IndividualOrder';
import Voucher from '../screens/Coupon/Voucher';
import ForgotPassword from '../screens/auth/ForgotPassword';
import Toast from 'react-native-toast-message';
import PaymentMethod from '../screens/Cart/PaymentMethod';
import ChangePassword from '../screens/Account/ChangePassword';

const Stack = createNativeStackNavigator();

const MainNavigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
        <Stack.Screen name="BottomNav" component={BottomBarNavigation} />
        <Stack.Screen name="TopNav" component={TopNavigation} />
        <Stack.Screen name="Cart" component={Cart} />
        <Stack.Screen name="PaymentMethod" component={PaymentMethod} />
        <Stack.Screen name="Payment" component={Payment} />
        <Stack.Screen name="Voucher" component={Voucher} />
        <Stack.Screen name="IndividualOrder" component={IndividualOrder} />
      </Stack.Navigator>
      <Toast position="top" topOffset={20} />
    </NavigationContainer>
  );
};

export default MainNavigation;
