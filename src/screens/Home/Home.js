import React, {useState, useEffect} from 'react';
import {View, Image, StyleSheet, ScrollView} from 'react-native';
import {Card, Layout, Text} from '@ui-kitten/components';
import FeaturedCard from '../../components/cards/FeaturedCard';
import {api} from '../../../config/api';
import {useDispatch, useSelector} from 'react-redux';
import {getAllFeatured} from '../../store/menu/menu';
import Loading from '../../components/Loading';

const Home = ({navigation, route}) => {
  const dispatch = useDispatch();
  const {userDetails} = useSelector(state => state.auth);
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(false);
  const [promotion, setPromotion] = useState(null);
  const [favorites, setFavorites] = useState([]);
  // const {loading, featured} = useSelector(state => state.menu);
  // useEffect(() => {
  //   const unsubscribe = navigation.addListener('focus', async () => {
  //     dispatch(getAllFeatured());
  //   });

  //   return unsubscribe;
  // }, [navigation]);
  useEffect(() => {
    api
      .get('api/getAllFeatured')
      .then(response => {
        setLoading(false);
        setFeatured(response.data);
      })
      .catch(err => {
        setLoading(false);
      });
    api
      .post('api/getUserFavorites', {
        user_id: userDetails.id,
      })
      .then(response => {
        setFavorites(response.data);
      })
      .catch(err => {
        console.log(err.response);
      });
    api
      .get('api/getPromotions')
      .then(response => {
        setPromotion(response.data);
      })
      .catch(err => {
        console.log(err.response);
      });
    const unsubscribe = navigation.addListener('focus', () => {
      setLoading(true);
      api
        .get('api/getAllFeatured')
        .then(response => {
          setLoading(false);
          setFeatured(response.data);
        })
        .catch(err => {
          setLoading(false);
        });
      api
        .post('api/getUserFavorites', {
          user_id: userDetails.id,
        })
        .then(response => {
          setFavorites(response.data);
        })
        .catch(err => {
          console.log(err.response);
        });
      api
        .get('api/getPromotions')
        .then(response => {
          setPromotion(response.data);
        })
        .catch(err => {
          console.log(err.response);
        });
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <Layout style={styles.container}>
      <ScrollView style={{flexGrow: 1}}>
        <Loading loading={loading} />
        <View
          style={{
            width: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 15,
          }}>
          {promotion != null ? (
            <Image
              source={{
                uri: `https://hbnaevis.online/HISBEANSapp-main/public/image/promo/${promotion.image_path}`,
              }}
              style={{height: 150, width: '90%'}}
            />
          ) : null}
        </View>
        <View style={{marginHorizontal: 15, marginVertical: 30}}>
          <Text category="h5">Hello, {userDetails.fname}!</Text>
          <Text style={{marginBottom: 15}}>
            Choose from the featured items that we have below.
          </Text>
          <ScrollView horizontal={true}>
            {featured.length > 0 ? (
              featured.map((item, index) => {
                return (
                  <FeaturedCard
                    onPress={() =>
                      navigation.navigate('MenuCustomization', {
                        id: item.id,
                        price: item.price,
                        description: item.item_description,
                        image: item.image_path,
                      })
                    }
                    menuImage={`https://hbnaevis.online/HISBEANSapp-main/public/image/menu/${item.image_path}`}
                    key={item.id}
                    name={item.item_name}
                    description={item.item_description}
                    price={item.price}
                  />
                );
              })
            ) : (
              <Card style={{width: '100%'}}>
                <Text>
                  No <Text style={{fontWeight: 'bold'}}>featured</Text> items to
                  display
                </Text>
              </Card>
            )}
          </ScrollView>
        </View>
        <View style={{marginHorizontal: 15, marginBottom: 20}}>
          <Text category="h5" style={{marginBottom: 15}}>
            My Favorites
          </Text>
          <ScrollView horizontal={true}>
            {favorites.length > 0 ? (
              favorites.map((item, index) => {
                return (
                  <FeaturedCard
                    onPress={() =>
                      navigation.navigate('MenuCustomization', {
                        id: item.id,
                        price: item.price,
                        description: item.item_description,
                        image: item.image_path,
                      })
                    }
                    menuImage={`https://hbnaevis.online/HISBEANSapp-main/public/image/menu/${item.image_path}`}
                    key={item.id}
                    name={item.item_name}
                    description={item.item_description}
                    price={item.price}
                  />
                );
              })
            ) : (
              <Card style={{width: '100%'}}>
                <Text>
                  No <Text style={{fontWeight: 'bold'}}>Favorites</Text> items
                  to display
                </Text>
              </Card>
            )}
          </ScrollView>
        </View>
      </ScrollView>
    </Layout>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Home;
