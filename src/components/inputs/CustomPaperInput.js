import React from 'react';
import {Text} from '@ui-kitten/components';
import {TextInput} from 'react-native-paper';

const CustomPaperInput = ({
  label,
  onChangeText,
  keyboardType,
  value,
  my,
  isPassword,
  textWhite,
  isHalf,
  isDisabled,
}) => {
  return (
    <TextInput
      disabled={isDisabled}
      mode="flat"
      style={{
        backgroundColor: 'transparent',
        marginVertical: my,
        width: isHalf ? '50%' : '100%',
      }}
      theme={{
        colors: {
          onSurfaceVariant: textWhite ? '#fff' : '#F25D3B',
          text: '#000',
        },
      }}
      keyboardType={keyboardType}
      underlineColor={textWhite ? '#fff' : '#000'}
      activeUnderlineColor={textWhite ? '#fff' : '#000'}
      textColor={textWhite ? '#fff' : '#000'}
      label={label}
      onChangeText={onChangeText}
      value={value}
      secureTextEntry={isPassword}
    />
  );
};

export default CustomPaperInput;
