import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as Animatable from 'react-native-animatable';

const BottoniScorrimento = ({ conto, navigation }) => {
    const textRef = useRef(null);
    useEffect(() => {
        textRef.current?.fadeInUp(2500);
    }, []);

    return (
        <>
            <View>
                <Animatable.View ref={textRef}>
                    {conto ? 
                    <View style={[styles.menuItem,{backgroundColor:'#54D169'}]}>
                        <TouchableOpacity onPress={() => navigation.navigate('configure', { conto: conto })} >
                            <Text style={styles.menuItemText}>Continua</Text>
                        </TouchableOpacity>
                    </View> :
                    <View style={[styles.menuItem,{backgroundColor:'#94eba3'}]}>
                        <Text style={styles.menuItemText}>Continua</Text>
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
        paddingTop: 7
    },
    tutorial: {
        color: 'white',
        fontSize: 16,
        textAlign: 'center',
        paddingTop: 25
    },
    menuItem: {
        marginTop: 44,
        borderRadius: 20,
        width: 165,
        height: 41
    }
});

export default BottoniScorrimento;
