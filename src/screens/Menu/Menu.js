import React, {useState, useEffect} from 'react';
import {View, ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
import {Text, Layout} from '@ui-kitten/components';
import {api} from '../../../config/api';
import {Alert} from 'react-native';
import UpdateCard from '../../components/cards/UpdateCard';
import Loading from '../../components/Loading';
import MenuCard from '../../components/cards/MenuCard';

const Menu = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const [currIndex, setCurrIndex] = useState(0);
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState('');
  const [menuItems, setMenuItems] = useState([]);
  useEffect(() => {
    setLoading(true);
    if (currIndex == 0) {
      api
        .get('api/getAllCategories')
        .then(response => {
          setCategories(response.data);
          api
            .get(`api/getSpecificCategory/${response.data[0].category_name}`)
            .then(menuResponse => {
              setMenuItems(menuResponse.data);
              setLoading(false);
            })
            .catch(err => {
              Alert.alert(
                'Error!',
                'There was a problem fetching the menu items!',
              );
              setLoading(false);
              console.log(err.response.data);
            });
        })
        .catch(err => {
          setLoading(false);
          console.log(err.response);
          Alert.alert('Error!', 'There was a problem fetching the categories!');
        });
    } else {
      api
        .get(`api/getSpecificCategory/${category}`)
        .then(response => {
          setLoading(false);
          setMenuItems(response.data);
        })
        .catch(err => {
          setLoading(false);
          Alert.alert('Error!', 'There was a problem fetching the meny items!');
        });
    }
    const unsubscribe = navigation.addListener('focus', () => {
      setLoading(true);
      if (currIndex == 0) {
        api
          .get('api/getAllCategories')
          .then(response => {
            setCategories(response.data);
            api
              .get(`api/getSpecificCategory/${response.data[0].category_name}`)
              .then(menuResponse => {
                setMenuItems(menuResponse.data);
                setLoading(false);
              })
              .catch(err => {
                Alert.alert(
                  'Error!',
                  'There was a problem fetching the menu items!',
                );
                setLoading(false);
                console.log(err.response.data);
              });
          })
          .catch(err => {
            setLoading(false);
            console.log(err.response);
            Alert.alert(
              'Error!',
              'There was a problem fetching the categories!',
            );
          });
      } else {
        api
          .get(`api/getSpecificCategory/${category}`)
          .then(response => {
            setLoading(false);
            setMenuItems(response.data);
          })
          .catch(err => {
            setLoading(false);
            Alert.alert(
              'Error!',
              'There was a problem fetching the meny items!',
            );
          });
      }
    });

    return unsubscribe;
  }, [category, navigation]);
  return (
    <Layout style={styles.container}>
      <Loading loading={loading} />
      <View style={{flex: 0.07}}>
        <ScrollView contentContainerStyle={{flexGrow: 1}} horizontal={true}>
          {categories
            ? categories.map((item, index) => {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      setCurrIndex(index);
                      setCategory(item.category_name);
                    }}
                    style={
                      index == currIndex ? styles.buttonActive : styles.button
                    }>
                    <Text category="h6" style={{color: '#000'}}>
                      {item.category_name}
                    </Text>
                  </TouchableOpacity>
                );
              })
            : null}
        </ScrollView>
      </View>
      <View style={{flex: 0.9}}>
        <ScrollView contentContainerStyle={{flexGrow: 1}}>
          {menuItems.length > 0
            ? menuItems.map((item, index) => {
                return (
                  <MenuCard
                    name={item.item_name}
                    description={item.item_description}
                    price={item.price}
                    onPress={
                      () =>
                        navigation.navigate('MenuCustomization', {
                          id: item.id,
                        })
                      // console.log(item.id)
                    }
                  />
                );
              })
            : null}
        </ScrollView>
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  buttonActive: {
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    justifyContent: 'center',
    borderColor: '#fff',
    borderBottomColor: '#f15a38',
    borderBottomWidth: 5,
  },
  button: {
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderColor: '#fff',
    borderWidth: 1,
    justifyContent: 'center',
  },
});

export default Menu;
