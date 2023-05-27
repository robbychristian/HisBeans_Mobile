import React from 'react';
import {StyleSheet} from 'react-native';
import {Input, Text} from '@ui-kitten/components';

const CustomTextInput = ({
  label,
  onChangeText,
  keyboardType,
  value,
  my,
  isHalf,
  placeholder,
  isPassword,
}) => {
  return (
    <Input
      style={{
        backgroundColor: '#fff',
        width: isHalf ? '50%' : '100%',
        marginVertical: my,
        borderRadius: 10,
      }}
      keyboardType={keyboardType}
      label={() => (
        <Text category="label" style={{color: '#f15a38'}}>
          {label}
        </Text>
      )}
      onChangeText={onChangeText}
      value={value}
      placeholder={placeholder}
      secureTextEntry={isPassword}
    />
  );
};

export default CustomTextInput;
