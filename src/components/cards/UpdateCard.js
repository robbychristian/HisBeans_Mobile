import React, {useState} from 'react';
import {View} from 'react-native';
import {Card, Text, ProgressBar} from '@ui-kitten/components';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {useEffect} from 'react';

const UpdateCard = ({
  status,
  temperature,
  name,
  quantity,
  orderNo,
  isPending,
}) => {
  const [progress, setProgress] = useState(0);
  const [favorite, setFavorite] = useState(false);
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
      console.log(false);
    } else {
      console.log(true);
      setFavorite(true);
    }
  };
  return (
    <View
      style={{
        paddingHorizontal: 15,
        paddingVertical: 5,
        backgroundColor: '#fff',
      }}>
      {isPending ? <ProgressBar progress={progress} status="warning" /> : null}
      <Card style={{backgroundColor: '#eee'}}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Icon name="coffee-outline" size={40} style={{marginRight: 30}} />
          <View>
            <Text style={{fontWeight: 'bold'}} category="h6">
              Order is {status}!
            </Text>
            <Text>
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
              width: '40%',
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
