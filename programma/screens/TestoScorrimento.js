import React, { useEffect, useRef } from 'react';
import { View } from 'react-native';
import * as Animatable from 'react-native-animatable';


const TestoScorrimento = () => {
  const textRef = useRef(null);

  useEffect(() => {
    textRef.current?.fadeInLeft(2500);
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Animatable.Text
        ref={textRef}
        style={{ fontSize: 16, color:'white', marginTop:30}}
      >
        {"Benvenuto su OkBill, l’applicazione\nche ti permette di dividere il conto\ncon i tuoi amici in maniera facile e\nveloce"}
      </Animatable.Text>
    </View>
  );
};

export default TestoScorrimento;
