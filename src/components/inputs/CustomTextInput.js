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
  isDisabled,
  textWhite,
}) => {
  return (
    <Input
      disabled={isDisabled}
      style={{
        backgroundColor: '#fff',
        width: isHalf ? '50%' : '100%',
        marginVertical: my,
        borderRadius: 10,
      }}
      keyboardType={keyboardType}
      label={() => (
        <Text category="label" style={{color: textWhite ? '#fff' : '#F25D3B'}}>
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
