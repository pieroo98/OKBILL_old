import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import * as Animatable from 'react-native-animatable';

const BottoniScorrimento = ({ conto, navigation, setConto }) => {
    const textRef = useRef(null);
    const [isSubmittedConfig, setIsSubmittedConfig] = useState(false);

    const toggleIsSubmittedConfig = () => {
        setIsSubmittedConfig(value => !value);
      };
    
    useEffect(() => {
    if (isSubmittedConfig === true) {
        setConto(filtered);
        navigation.setParams({conto : String(filtered)});
        navigation.navigate('configure', { conto: conto}); 
    }
    }, [isSubmittedConfig]);

    let segnoMeno = false;
    let regex = /[a-zA-Z]+$/;
    useEffect(() => {
        textRef.current?.fadeInUp(2500);
    }, []);
    let filtered = conto;

    if(isNaN(conto) || conto ==" "){
        segnoMeno = true;
                filtered = 0;
    }
    if(conto.includes("-")){
        segnoMeno = true;
        filtered = 0;
    }
    else if(conto.includes(",") && !segnoMeno){
        let virg = conto.split(",");
        if(virg[0]=="" && virg.length==2){
            if( virg[1].includes(".")){
                segnoMeno = true;
                filtered = 0;
            }
            else {
                let ok = '0'
                let ok2 = ok.concat(".").concat(virg[1]);
                filtered = parseFloat(ok2).toFixed(2);
            }
        }
        else if (virg[0]!="" && virg.length==2){
            if(virg[0].includes(".") || virg[1].includes(".")){
                segnoMeno = true;
                filtered = 0;
            }
            else {
                let ok2 = virg[0].concat(".").concat(virg[1]);
                filtered = parseFloat(ok2).toFixed(2);
            }  
        }
        else if (virg.length>2){
            segnoMeno= true;
            filtered = 0;
        }
    }
    
    else if (conto.includes(".") && !segnoMeno){
        let virg = conto.split(".");
        if(virg[0]=="" && virg.length==2){
            let ok = '0'
            let ok2 = ok.concat(".").concat(virg[1]);
            filtered = parseFloat(ok2).toFixed(2);
        }
        else if (virg[0]!="" && virg.length==2){
            let ok2 = virg[0].concat(".").concat(virg[1]);
            filtered = parseFloat(ok2).toFixed(2);
        }
        else if(virg.length>2){
            segnoMeno= true;
            filtered = 0;
        }
    }

    else if (regex.test(conto)){
        segnoMeno= true;
        filtered = 0;
    }
    
    const handlePress = () => {
        Alert.alert(
          'Errore di formato',
          'scrivi il conto correttamente per continuare',
          [
            { text: 'OK', onPress: () => {} },
          ]
        );
      };
    return (
        <>
            <View>
                <Animatable.View ref={textRef}>
                    {filtered ? 
                    <View style={[styles.menuItem,{backgroundColor:'#54D169'}]}>
                        <TouchableOpacity onPress={toggleIsSubmittedConfig} >
                            <Text style={styles.menuItemText}>Continua</Text>
                        </TouchableOpacity>
                    </View> :
                    <View style={[styles.menuItem,{backgroundColor:'#94eba3'}]}>
                        <TouchableOpacity onPress={handlePress}>
                            <Text style={styles.menuItemText}>Continua</Text>
                        </TouchableOpacity>
                    </View>}
                    <TouchableOpacity>
                        <Text style={styles.tutorial} >Tutorial</Text>
                    </TouchableOpacity>
                </Animatable.View>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    menuItemText: {
        fontSize: 16,
        color: 'white',
        textAlignVertical: 'auto',
        textAlign: 'center',
        paddingTop: 7,
        fontFamily:'Montserrat-Regular'
    },
    tutorial: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
        paddingTop: 25,
        fontFamily:'Montserrat-Regular'
    },
    menuItem: {
        marginTop: 44,
        borderRadius: 20,
        width: 165,
        height: 41
    }
});

export default BottoniScorrimento;
