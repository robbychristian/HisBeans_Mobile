import React, {useState, useEffect} from 'react';
import {View, Image} from 'react-native';
import {Text, Radio, RadioGroup, CheckBox, Button} from '@ui-kitten/components';
import {useNavigation, useRoute} from '@react-navigation/native';
import {ScrollView} from 'react-native';
import FeaturedCard from '../../components/cards/FeaturedCard';
import {api} from '../../../config/api';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Alert} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {setOrderInput} from '../../store/menu/menu';

const MenuCustomization = () => {
  const routes = useRoute();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {userDetails} = useSelector(state => state.auth);
  const [temperatureIndex, setTemperatureIndex] = useState(0);
  const [addOnsIndex, setAddOnsIndex] = useState([]);
  const [addOnsValues, setAddOnsValues] = useState([]);
  const [addOns, setAddOns] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(routes.params.price);
  const [orderDetails, setOrderDetails] = useState(null);

  const addQuantity = () => {
    setQuantity(quantity + 1);
  };

  const subtractQuantity = () => {
    if (quantity != 1) {
      setQuantity(quantity - 1);
    } else {
      Alert.alert('Error!', 'Minimum quantity should not be below 1.');
    }
  };

  const onSubmit = () => {
    let addOnsIds = [];
    let temperatureValue = '';
    let addOnsPrice = 0;
    if (temperatureIndex == 0) {
      temperatureValue = 'Hot';
    } else {
      temperatureValue = 'Iced';
    }
    addOnsValues.map((item, index) => {
      addOnsIds.push(item.name);
      addOnsPrice = addOnsPrice + Number(item.price);
    });

    api
      .post('api/getSpecificMenu', {
        id: routes.params.id,
      })
      .then(response => {
        const formdata = new FormData();
        formdata.append('user_id', userDetails.id);
        formdata.append('menu_id', routes.params.id);
        formdata.append('addons_id', JSON.stringify(addOnsIds));
        formdata.append('drink_temperature', temperatureValue);
        formdata.append('drink_name', response.data.item_name);
        formdata.append(
          'drink_price',
          (Number(response.data.price) + addOnsPrice) * quantity,
        );
        formdata.append('drink_quantity', quantity);

        api
          .post('api/addToCart', formdata)
          .then(response => {
            console.log(response.data);
            Alert.alert(
              'Added To Cart!',
              'The item has been added to your cart.',
            );
            navigation.goBack();
          })
          .catch(err => {
            console.log(err.response);
          });
      })
      .catch(err => {
        console.log(err.response);
      });
  };

  useEffect(() => {
    api
      .get('api/getAllAddOns')
      .then(response => {
        const addOnsData = response.data;
        let tempIndex = [];
        addOnsData.map((item, index) => {
          tempIndex.push({
            index: item.id,
            checked: false,
          });
        });

        setAddOnsIndex(tempIndex);
        setAddOns(response.data);
      })
      .catch(err => {
        console.log(err.response);
      });

    const unsubscribe = navigation.addListener('focus', () => {
      setTotalPrice(routes.params.price);
      api
        .get('api/getAllAddOns')
        .then(response => {
          const addOnsData = response.data;
          let tempIndex = [];
          addOnsData.map((item, index) => {
            tempIndex.push({
              index: item.id,
              checked: false,
            });
          });

          setAddOnsIndex(tempIndex);
          setAddOns(response.data);
        })
        .catch(err => {
          console.log(err.response);
        });
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (quantity > 0) {
      let tempPrice = routes.params.price;
      addOnsValues.map((item, index) => {
        tempPrice = Number(tempPrice) + Number(item.price);
      });
      tempPrice = Number(tempPrice) * Number(quantity);
      setTotalPrice(tempPrice);
    }
  }, [quantity, addOnsValues]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      setAddOnsValues([]);
      setQuantity(1);
      setTemperatureIndex(0);
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#fff',
      }}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 20,
          paddingVertical: 10,
        }}>
        <View style={{marginVertical: 10, alignItems: 'center'}}>
          <Image
            source={{
              uri: `https://hbnaevis.online/HISBEANSapp-main/public/image/menu/${routes.params.image}`,
            }}
            style={{height: 200, width: 200}}
          />
          <Text category="label" style={{textAlign: 'center'}}>
            {routes.params.description}
          </Text>
        </View>
        <View style={{marginVertical: 10}}>
          <Text category="h6">Temperature</Text>
          <RadioGroup
            style={{flexDirection: 'row'}}
            selectedIndex={temperatureIndex}
            onChange={index => setTemperatureIndex(index)}>
            <Radio style={{marginRight: 50}}>Hot</Radio>
            <Radio>Iced</Radio>
          </RadioGroup>
        </View>
        <View>
          <Text category="h6" style={{marginBottom: 10}}>
            Choose an add-on
          </Text>
          {addOns.length != 0
            ? addOns.map((item, index) => {
                if (item.addons_price == 30) {
                  return (
                    <View
                      style={{
                        marginRight: 10,
                        padding: 15,
                      }}>
                      <View
                        style={{
                          justifyContent: 'space-between',
                          flexDirection: 'row',
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                          }}>
                          <CheckBox
                            style={{marginRight: 10}}
                            checked={addOnsIndex[item.id - 1].checked}
                            onChange={value => {
                              let newArr = [...addOnsIndex];
                              let newAddOns = [...addOnsValues];
                              if (value === true) {
                                console.log(addOnsIndex[item.id - 1]);
                                newAddOns.push({
                                  id: item.id,
                                  name: item.addons_name,
                                  price: item.addons_price,
                                });
                                setAddOnsValues(newAddOns);
                              } else {
                                setAddOnsValues(current =>
                                  current.filter(
                                    addOnsValues => addOnsValues.id !== item.id,
                                  ),
                                );
                              }
                              newArr[item.id - 1].checked = value;
                              setAddOnsIndex(newArr);
                            }}
                          />
                          <Text category="h6" style={{fontSize: 16}}>
                            {item.addons_name}
                          </Text>
                        </View>
                        <Text
                          style={{fontSize: 15, textAlign: 'right'}}
                          category="label"
                          appearance="hint">
                          +{item.addons_price}
                        </Text>
                      </View>
                    </View>
                  );
                }
              })
            : null}
        </View>
        <View>
          {addOns.length != 0
            ? addOns.map((item, index) => {
                if (item.addons_price == 25) {
                  return (
                    <View
                      style={{
                        marginRight: 10,
                        padding: 15,
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                          }}>
                          <CheckBox
                            style={{marginRight: 10}}
                            checked={addOnsIndex[item.id - 1].checked}
                            onChange={value => {
                              let newArr = [...addOnsIndex];
                              let newAddOns = [...addOnsValues];
                              if (value === true) {
                                console.log(addOnsIndex[item.id - 1]);
                                newAddOns.push({
                                  id: item.id,
                                  name: item.addons_name,
                                  price: item.addons_price,
                                });
                                setAddOnsValues(newAddOns);
                              } else {
                                setAddOnsValues(current =>
                                  current.filter(
                                    addOnsValues => addOnsValues.id !== item.id,
                                  ),
                                );
                              }
                              newArr[item.id - 1].checked = value;
                              setAddOnsIndex(newArr);
                            }}
                          />
                          <Text category="h6" style={{fontSize: 16}}>
                            {item.addons_name}
                          </Text>
                        </View>
                        <Text
                          style={{fontSize: 15}}
                          category="label"
                          appearance="hint">
                          +{item.addons_price}
                        </Text>
                      </View>
                    </View>
                  );
                }
              })
            : null}
        </View>
        <View>
          {addOns.length != 0
            ? addOns.map((item, index) => {
                if (item.addons_price == 20) {
                  return (
                    <View style={{marginRight: 10, padding: 15}}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                          }}>
                          <CheckBox
                            style={{marginRight: 10}}
                            checked={addOnsIndex[item.id - 1].checked}
                            onChange={value => {
                              let newArr = [...addOnsIndex];
                              let newAddOns = [...addOnsValues];
                              if (value === true) {
                                console.log(addOnsIndex[item.id - 1]);
                                newAddOns.push({
                                  id: item.id,
                                  name: item.addons_name,
                                  price: item.addons_price,
                                });
                                setAddOnsValues(newAddOns);
                              } else {
                                setAddOnsValues(current =>
                                  current.filter(
                                    addOnsValues => addOnsValues.id !== item.id,
                                  ),
                                );
                              }
                              newArr[item.id - 1].checked = value;
                              setAddOnsIndex(newArr);
                            }}
                          />
                          <Text category="h6" style={{fontSize: 16}}>
                            {item.addons_name}
                          </Text>
                        </View>
                        <Text
                          style={{fontSize: 15}}
                          category="label"
                          appearance="hint">
                          +{item.addons_price}
                        </Text>
                      </View>
                    </View>
                  );
                }
              })
            : null}
          {/* {addOns.length != 0
            ? addOns.map((item, index) => {
                if (item.id > 8) {
                  return (
                    <View
                      style={{
                        marginRight: 10,
                        padding: 15,
                      }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                          }}>
                          <CheckBox
                            style={{marginRight: 10}}
                            checked={addOnsIndex[item.id - 1].checked}
                            onChange={value => {
                              let newArr = [...addOnsIndex];
                              let newAddOns = [...addOnsValues];
                              if (value === true) {
                                console.log(addOnsIndex[item.id - 1]);
                                newAddOns.push({
                                  id: item.id,
                                  name: item.addons_name,
                                  price: item.addons_price,
                                });
                                setAddOnsValues(newAddOns);
                              } else {
                                setAddOnsValues(current =>
                                  current.filter(
                                    addOnsValues => addOnsValues.id !== item.id,
                                  ),
                                );
                              }
                              newArr[item.id - 1].checked = value;
                              setAddOnsIndex(newArr);
                            }}
                          />
                          <Text category="h6" style={{fontSize: 16}}>
                            {item.addons_name}
                          </Text>
                        </View>
                        <Text
                          style={{fontSize: 15}}
                          category="label"
                          appearance="hint">
                          +{item.addons_price}
                        </Text>
                      </View>
                    </View>
                  );
                }
              })
            : null} */}
        </View>
      </ScrollView>
      <View
        style={{borderWidth: 0.5, borderBottomWidth: 0, paddingHorizontal: 20}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 15,
            marginTop: 10,
          }}>
          <Text>₱{totalPrice}</Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Icon
              name="minus-box"
              size={30}
              color="#dc3545"
              onPress={() => subtractQuantity()}
            />
            <Text style={{marginHorizontal: 15}}>{quantity}</Text>
            <Icon
              name="plus-box"
              size={30}
              color="#198754"
              onPress={() => addQuantity()}
            />
          </View>
        </View>
        <View
          style={{
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Button
            onPress={() => {
              onSubmit();
            }}
            style={{
              width: '90%',
              backgroundColor: '#F25D3B',
              borderColor: '#F25D3B',
            }}>
            Add to Cart
          </Button>
        </View>
      </View>
    </View>
  );
};

export default MenuCustomization;
