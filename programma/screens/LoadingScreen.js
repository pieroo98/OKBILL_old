import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Image, Keyboard, useWindowDimensions, ScrollView } from 'react-native';
import BottoniScorrimento from './BottoniScorrimento';
import TestoScorrimento from './TestoScorrimento';

const LoadingScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [conto, setConto] = useState('');
  const { width, height } = useWindowDimensions();


  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2500);
  }, []);

  const valore = (height / 4);
  return (
    <ScrollView style={{ backgroundColor: '#121212' }} >
      <View style={{ backgroundColor: '#121212', alignItems: 'center', flex: 1 }}>
        <Image source={require('../assets/logo2.png')} style={[styles.image, { marginTop: valore }]} />
        {loading ? null :
          <>
            <TestoScorrimento />
            <View style={{ marginTop: 70 }}>
              <TextInput
                placeholder={` Inserisci l'importo totale del conto        `}
                placeholderTextColor='#9E9E9E'
                keyboardType="numeric"
                value={conto}
                onChangeText={conto => setConto(conto)}
                onSubmitEditing={() => { Keyboard.dismiss(); }}
                returnKeyType="send"
                multiline={false}
                textAlignVertical='top'
                style={{ borderColor: conto ? '#54d169' : '#858585',  borderWidth: 1, borderRadius: 20, padding:7, color: 'white', textAlignVertical: 'auto', textAlign: 'center', fontSize:15, fontFamily:'Montserrat-Regular',  }}
              />
            </View>
            <BottoniScorrimento navigation={navigation} conto={conto} setConto={setConto} />
          </>
        }
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  image: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    resizeMode: 'contain',
    width: 194,
    height: 60,
  },
});

export default LoadingScreen;
