import React, {useState} from 'react';
import {View} from 'react-native';
import {Card, Text, ProgressBar} from '@ui-kitten/components';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useEffect} from 'react';
import {api} from '../../../config/api';
import {useSelector} from 'react-redux';

const UpdateCard = ({
  id,
  status,
  temperature,
  name,
  quantity,
  orderNo,
  isPending,
  isFavorite,
}) => {
  const {userDetails} = useSelector(state => state.auth);
  const [progress, setProgress] = useState(0);
  const [favorite, setFavorite] = useState(isFavorite);
  useEffect(() => {
    let prog = 0;
    const interval = setInterval(() => {
      if (prog >= 1) {
        prog = 0;
        setProgress(0);
      } else {
        prog = prog + 0.1;
        setProgress(prog);
      }
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const onFav = () => {
    if (favorite) {
      setFavorite(false);
      api
        .post('api/removeToFavorites', {
          id: id,
        })
        .then(response => {
          console.log(response.data);
        })
        .catch(err => {
          console.log(err.response);
        });
    } else {
      setFavorite(true);
      api
        .post('api/addToFavorites', {
          id: id,
        })
        .then(response => {
          console.log(response.data);
        })
        .catch(err => {
          console.log(err.response);
        });
    }
  };
  return (
    <View
      style={{
        paddingHorizontal: 15,
        paddingVertical: 5,
        backgroundColor: '#fff',
      }}>
      {/* {isPending ? <ProgressBar progress={progress} status="warning" /> : null} */}
      <Card style={{backgroundColor: '#eee'}}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Icon name="coffee-outline" size={40} style={{marginRight: 30}} />
          <View style={{width: '60%'}}>
            <Text style={{fontWeight: 'bold'}} category="h6">
              Order is {status}!
            </Text>
            <Text style={{width: '80%'}}>
              {quantity}x {temperature} {name}
            </Text>
            {orderNo ? (
              <Text category="label">Order Number: {orderNo}</Text>
            ) : null}
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              width: '20%',
            }}>
            {favorite ? (
              <Icon
                name="star"
                size={30}
                color="#ffc107"
                onPress={() => onFav()}
              />
            ) : (
              <Icon
                name="star-outline"
                size={30}
                color="#ffc107"
                onPress={() => onFav()}
              />
            )}
          </View>
        </View>
      </Card>
    </View>
  );
};

export default UpdateCard;
