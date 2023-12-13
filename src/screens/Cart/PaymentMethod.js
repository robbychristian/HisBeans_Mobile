import React, {useState} from 'react';
import {View, ScrollView, TouchableOpacity, Image} from 'react-native';
import {Text, Button} from '@ui-kitten/components';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDispatch, useSelector} from 'react-redux';
import {setModeOfPayment, setReferenceNumber} from '../../store/menu/Menu';
import CustomTextInput from '../../components/inputs/CustomTextInput';
import Toast from 'react-native-toast-message';

const PaymentMethod = ({navigation, route}) => {
  const {modeOfPayment, referenceNumber} = useSelector(state => state.menu);
  const [change, setChange] = useState(0);
  const [refNo, setRefNo] = useState('');

  //Credit Card
  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [cardNo, setCardNo] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [securityNo, setSecurityNo] = useState('');

  const dispatch = useDispatch();
  return (
    <View style={{flex: 1, width: '100%', backgroundColor: '#fff'}}>
      <View
        style={{
          width: '100%',
          backgroundColor: '#fff',
          paddingHorizontal: 10,
          paddingVertical: 15,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Icon
          name="arrow-left"
          size={30}
          color={'#F25D3B'}
          onPress={() => {
            if (modeOfPayment != 'GCash') {
              navigation.goBack();
            } else {
              Toast.show({
                type: 'info',
                text1: 'Warning!',
                text2: 'Please make sure reference number is not empty',
              });
            }
          }}
        />
        <Text category="h5" style={{color: '#000', marginRight: 30}}>
          Payment Method
        </Text>
        <Text category="h5" style={{color: '#fff'}}></Text>
      </View>
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'space-between',
            flexDirection: 'row',
            marginHorizontal: 20,
          }}>
          <TouchableOpacity
            onPress={() => {
              dispatch(setModeOfPayment('Cash'));
              dispatch(setReferenceNumber(''));
              setCardNo('');
            }}
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              width: '33%',
              height: 80,
              borderColor: modeOfPayment == 'Cash' ? '#F25D3B' : '#ddd',
              borderWidth: 1,
            }}>
            <Text>Cash</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              dispatch(setModeOfPayment('GCash'));
              setChange(0);
              setCardNo('');
            }}
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              width: '33%',
              height: 80,
              borderColor: modeOfPayment == 'GCash' ? '#F25D3B' : '#ddd',
              borderWidth: 1,
            }}>
            <Image
              source={require('../../../assets/logo/GCash-Logo.png')}
              style={{height: 40, width: 80}}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              dispatch(setModeOfPayment('Credit Card'));
              dispatch(setReferenceNumber(''));
              setChange(0);
            }}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              width: '33%',
              height: 80,
              borderColor: modeOfPayment == 'Credit Card' ? '#F25D3B' : '#ddd',
              borderWidth: 1,
            }}>
            <Text style={{fontSize: 12}}>Credit Card</Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                source={require('../../../assets/icons/mastercard-icon.png')}
                style={{width: 35, height: 20}}
              />
              <Image
                source={require('../../../assets/icons/visa-icon.png')}
                style={{width: 35, height: 12}}
              />
            </View>
          </TouchableOpacity>
        </View>
        {modeOfPayment == 'Cash' ? (
          <View style={{paddingHorizontal: 20}}>
            <CustomTextInput
              label={`Change`}
              value={change}
              onChangeText={value => setChange(value)}
              my={15}
              keyboardType={`numeric`}
            />
          </View>
        ) : modeOfPayment == 'GCash' ? (
          <View style={{paddingHorizontal: 20}}>
            <CustomTextInput
              label={`GCash Reference Number`}
              value={referenceNumber}
              keyboardType={`numeric`}
              onChangeText={value => dispatch(setReferenceNumber(value))}
              my={15}
            />
          </View>
        ) : (
          <View style={{paddingHorizontal: 20}}>
            <View style={{flexDirection: 'row'}}>
              <CustomTextInput
                label={`First Name`}
                value={fname}
                onChangeText={value => setFname(value)}
                my={15}
                isHalf
              />
              <CustomTextInput
                label={`Last Name`}
                value={lname}
                onChangeText={value => setLname(value)}
                my={15}
                isHalf
              />
            </View>
            <CustomTextInput
              label={`Card Number`}
              value={cardNo}
              onChangeText={value => setCardNo(value)}
              keyboardType={`numeric`}
            />
            <View style={{flexDirection: 'row'}}>
              <CustomTextInput
                label={`Expiry Date`}
                value={expiryDate}
                onChangeText={value => setExpiryDate(value)}
                my={15}
                isHalf
              />
              <CustomTextInput
                label={`Security Number`}
                value={securityNo}
                onChangeText={value => setSecurityNo(value)}
                my={15}
                isHalf
              />
            </View>
          </View>
        )}
      </ScrollView>
      <View
        style={{
          width: '100%',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginVertical: 20,
        }}>
        {modeOfPayment == 'Cash' ? (
          <Button
            onPress={() => navigation.navigate('Cart')}
            disabled={change == 0 ? true : false}
            style={{
              width: '90%',
              backgroundColor: change == 0 ? '#dedede' : '#F25D3B',
              borderColor: change == 0 ? '#dedede' : '#F25D3B',
            }}>
            Save
          </Button>
        ) : modeOfPayment == 'GCash' ? (
          <Button
            onPress={() => navigation.navigate('Cart')}
            disabled={referenceNumber == '' ? true : false}
            style={{
              width: '90%',
              backgroundColor: referenceNumber == '' ? '#dedede' : '#F25D3B',
              borderColor: referenceNumber == '' ? '#dedede' : '#F25D3B',
            }}>
            Save
          </Button>
        ) : (
          <Button
            onPress={() => navigation.navigate('Cart')}
            disabled={cardNo == '' ? true : false}
            style={{
              width: '90%',
              backgroundColor: cardNo == '' ? '#dedede' : '#F25D3B',
              borderColor: cardNo == '' ? '#dedede' : '#F25D3B',
            }}>
            Save
          </Button>
        )}
      </View>
    </View>
  );
};

export default PaymentMethod;
