import React, {useState, useEffect} from 'react';
import {View} from 'react-native';
import {Text, Radio, RadioGroup, CheckBox, Button} from '@ui-kitten/components';
import {useNavigation, useRoute} from '@react-navigation/native';
import {ScrollView} from 'react-native';
import FeaturedCard from '../../components/cards/FeaturedCard';
import {api} from '../../../config/api';

const MenuCustomization = () => {
  const routes = useRoute();
  const navigation = useNavigation();
  const [temperatureIndex, setTemperatureIndex] = useState(0);
  const [addOnsIndex, setAddOnsIndex] = useState([]);
  const [addOnsValues, setAddOnsValues] = useState([]);
  const [addOns, setAddOns] = useState([]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
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
  return (
    <View
      style={{
        flex: 1,
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: '#fff',
      }}>
      <ScrollView contentContainerStyle={{flexGrow: 1}}>
        <View style={{marginVertical: 10}}>
          <Text category="h6">Temperature</Text>
          <RadioGroup
            selectedIndex={temperatureIndex}
            onChange={index => setTemperatureIndex(index)}>
            <Radio>Hot</Radio>
            <Radio>Iced</Radio>
          </RadioGroup>
        </View>
        <View style={{marginVertical: 10}}>
          <Text category="h6" style={{marginBottom: 10}}>
            Add-ons (P30)
          </Text>
          <ScrollView horizontal>
            {addOns.length != 0 &&
              addOns.map((item, index) => {
                if (item.price == 30) {
                  return (
                    <View
                      style={{
                        marginRight: 10,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#eee',
                        borderWidth: 0.4,
                        borderColor: '#9f9f9f',
                        padding: 15,
                      }}>
                      <View style={{flexDirection: 'row'}}>
                        <CheckBox
                          style={{marginRight: 10}}
                          checked={addOnsIndex[item.id].checked}
                          onChange={value => {
                            let newArr = [...addOnsIndex];
                            let newAddOns = [...addOnsValues];
                            if (value === true) {
                              newAddOns.push({
                                id: item.id,
                                name: item.addons_name,
                                price: item.price,
                              });
                              setAddOnsValues(newAddOns);
                            } else {
                              setAddOnsValues(current =>
                                current.filter(
                                  addOnsValues => addOnsValues.id !== item.id,
                                ),
                              );
                            }
                            newArr[item.id].checked = value;
                            setAddOnsIndex(newArr);
                          }}
                        />
                        <Text category="h6">{item.addons_name}</Text>
                      </View>
                      <Text
                        style={{fontSize: 15}}
                        category="label"
                        appearance="hint">
                        P{item.price}
                      </Text>
                    </View>
                  );
                }
              })}
          </ScrollView>
        </View>
        <View style={{marginVertical: 10}}>
          <Text category="h6" style={{marginBottom: 10}}>
            Add-ons (P25)
          </Text>
          <ScrollView horizontal>
            {addOns.length != 0 &&
              addOns.map((item, index) => {
                if (item.price == 25) {
                  return (
                    <View
                      style={{
                        marginRight: 10,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#eee',
                        borderWidth: 0.4,
                        borderColor: '#9f9f9f',
                        padding: 15,
                      }}>
                      <View style={{flexDirection: 'row'}}>
                        <CheckBox
                          style={{marginRight: 10}}
                          checked={addOnsIndex[item.id].checked}
                          onChange={value => {
                            let newArr = [...addOnsIndex];
                            let newAddOns = [...addOnsValues];
                            if (value === true) {
                              newAddOns.push({
                                id: item.id,
                                name: item.addons_name,
                                price: item.price,
                              });
                              setAddOnsValues(newAddOns);
                            } else {
                              setAddOnsValues(current =>
                                current.filter(
                                  addOnsValues => addOnsValues.id !== item.id,
                                ),
                              );
                            }
                            newArr[item.id].checked = value;
                            setAddOnsIndex(newArr);
                          }}
                        />
                        <Text category="h6">{item.addons_name}</Text>
                      </View>
                      <Text
                        style={{fontSize: 15}}
                        category="label"
                        appearance="hint">
                        P{item.price}
                      </Text>
                    </View>
                  );
                }
              })}
          </ScrollView>
        </View>
        <View style={{marginVertical: 10}}>
          <Text category="h6" style={{marginBottom: 10}}>
            Add-ons (P20)
          </Text>
          <ScrollView horizontal>
            {addOns.length != 0 &&
              addOns.map((item, index) => {
                if (item.id >= 9) {
                  return (
                    <View
                      style={{
                        marginRight: 10,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: '#eee',
                        borderWidth: 0.4,
                        borderColor: '#9f9f9f',
                        padding: 15,
                      }}>
                      <View style={{flexDirection: 'row'}}>
                        <CheckBox
                          style={{marginRight: 10}}
                          checked={addOnsIndex[item.id - 1].checked}
                          onChange={value => {
                            let newArr = [...addOnsIndex];
                            let newAddOns = [...addOnsValues];
                            if (value === true) {
                              newAddOns.push({
                                id: item.id,
                                name: item.addons_name,
                                price: item.price,
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
                        <Text category="h6">{item.addons_name}</Text>
                      </View>
                      <Text
                        style={{fontSize: 15}}
                        category="label"
                        appearance="hint">
                        P{item.price}
                      </Text>
                    </View>
                  );
                }
              })}
          </ScrollView>
        </View>
        <View
          style={{
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Button
            onPress={() => {
              console.log(addOnsValues);
            }}
            style={{
              width: '90%',
              backgroundColor: '#f15a38',
              borderColor: '#f15a38',
            }}>
            Order
          </Button>
        </View>
      </ScrollView>
    </View>
  );
};

export default MenuCustomization;
