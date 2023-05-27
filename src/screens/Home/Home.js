import React, {useState, useEffect} from 'react';
import {View, Image, StyleSheet, ScrollView} from 'react-native';
import {Layout, Text} from '@ui-kitten/components';
import FeaturedCard from '../../components/cards/FeaturedCard';
import {api} from '../../../config/api';
import {useDispatch, useSelector} from 'react-redux';
import {getAllFeatured} from '../../store/menu/menu';
import Loading from '../../components/Loading';

const Home = ({navigation, route}) => {
  const dispatch = useDispatch();
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(false);
  // const {loading, featured} = useSelector(state => state.menu);
  // useEffect(() => {
  //   const unsubscribe = navigation.addListener('focus', async () => {
  //     dispatch(getAllFeatured());
  //   });

  //   return unsubscribe;
  // }, [navigation]);
  useEffect(() => {
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
          <Image
            source={require('../../../assets/logo/logo-black.png')}
            style={{height: 100, width: '90%'}}
          />
        </View>
        <View style={{marginHorizontal: 15, marginVertical: 30}}>
          <Text category="h5">Good Morning, User!</Text>
          <Text style={{marginBottom: 15}}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </Text>
          <ScrollView horizontal={true}>
            {featured
              ? featured.map((item, index) => {
                  return (
                    <FeaturedCard
                      key={item.id}
                      name={item.item_name}
                      description={item.item_description}
                      price={item.price}
                    />
                  );
                })
              : null}
          </ScrollView>
        </View>
        <View style={{marginHorizontal: 15, marginBottom: 20}}>
          <Text category="h5" style={{marginBottom: 15}}>
            My Favorites
          </Text>
          <ScrollView horizontal={true}>
            <FeaturedCard />
            <FeaturedCard />
            <FeaturedCard />
            <FeaturedCard />
            <FeaturedCard />
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