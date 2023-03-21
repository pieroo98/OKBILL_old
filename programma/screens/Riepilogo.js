import React from 'react';
import { ScrollView, Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const Riepilogo = ({ route }) => {
    const navigation = useNavigation();
    let duepervolta = [];
    let final = [];
    if (route.params.items.length % 2 == 0) {
        for (let i = 0; i < route.params.items.length; i = i + 2) {
            duepervolta.push(route.params.items[i]);
            duepervolta.push(route.params.items[i + 1]);
            final.push(duepervolta);
            duepervolta = [];
        }
    }
    else {
        let i = 0;
        for (i = 0; i < route.params.items.length - 2; i = i + 2) {
            duepervolta.push(route.params.items[i]);
            duepervolta.push(route.params.items[i + 1]);
            final.push(duepervolta);
            duepervolta = [];
        }
        duepervolta = route.params.items[i];
        final.push(duepervolta);
    }
    return (
        <>
            <View style={{ backgroundColor: '#121212' }} >
                <Text style={{ color: 'white', fontSize: 16, textAlign: 'center', marginTop: 15, marginBottom: 10, fontFamily:'Montserrat-Regular' }}>{"Ecco quanto pagherete"}</Text>
            </View>
            <ScrollView style={{ backgroundColor: '#121212' }} >

                {final.map((item, i) => {
                    if (item.length > 1) {
                        return (
                            <View key={i} >
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, marginTop: 21 }}>
                                    <View style={{ width: 169, height: 61, backgroundColor: '#1D1D1D', marginLeft: 20, borderRadius: 50, borderWidth: 1, borderColor: '#54d169' }} >
                                        <Text style={{ fontSize: 14, color: 'white', alignSelf: 'center',  fontFamily:'Montserrat-Regular' }}>{item[0].persona}</Text>
                                        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                            <Text style={{ fontSize: 24, color: 'white', alignSelf: 'center',  fontFamily:'Montserrat-Regular' }}>{item[0].soldi}</Text>
                                            <Text style={{ fontSize: 24, color: '#54d169', alignSelf: 'center',  fontFamily:'Montserrat-Regular' }}>{' €'}</Text>
                                        </View>
                                    </View>
                                    <View style={{ width: 169, height: 61, backgroundColor: '#1D1D1D', marginRight: 20, borderRadius: 50, borderWidth: 1, borderColor: '#54d169' }} >
                                        <Text style={{ fontSize: 14, color: 'white', alignSelf: 'center',  fontFamily:'Montserrat-Regular' }}>{item[1].persona}</Text>
                                        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                            <Text style={{ fontSize: 24, color: 'white', alignSelf: 'center', fontFamily:'Montserrat-Regular' }}>{item[1].soldi}</Text>
                                            <Text style={{ fontSize: 24, color: '#54d169', alignSelf: 'center',  fontFamily:'Montserrat-Regular' }}>{' €'}</Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        )
                    }
                    else {
                        return (
                            <View key={i} style={styles.item}>
                                <View style={{ width: 169, height: 61, backgroundColor: '#1D1D1D', marginTop: 21, borderRadius: 50, marginLeft: 20, borderWidth: 1, borderColor: '#54d169' }}>
                                    <Text style={{ fontSize: 14, color: 'white', alignSelf: 'center',  fontFamily:'Montserrat-Regular' }}>{item.persona}</Text>
                                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                        <Text style={{ fontSize: 24, color: 'white', alignSelf: 'center',  fontFamily:'Montserrat-Regular' }}>{item.soldi}</Text>
                                        <Text style={{ fontSize: 24, color: '#54d169', alignSelf: 'center',  fontFamily:'Montserrat-Regular' }}>{' €'}</Text>
                                    </View>
                                </View>
                            </View>
                        )
                    }

                })}

            </ScrollView>
            <View style={{ backgroundColor: '#121212', paddingTop: 20 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 }}>
                    <View style={{ width: 127, height: 41, backgroundColor: '#1D1D1D', marginLeft: 20, borderRadius: 20, borderColor: '#54d169', borderWidth: 1 }}>
                        <TouchableOpacity onPress={() => navigation.navigate('setup',{conto: route.params.conto, persone: route.params.persone, mancia: route.params.mancia, quotaxPers: route.params.quotaxPers, totale: route.params.totale})} style={{ justifyContent: 'center', flexDirection: 'row', }}>
                            <Text style={[styles.menuItemText, { paddingVertical: 7 }]}>Indietro</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ width: 127, height: 41, backgroundColor: '#54d169', marginRight: 20, borderRadius: 20, borderColor: '#54d169', borderWidth: 1 }}>
                        <TouchableOpacity onPress={() =>{
                        navigation.setParams({conto : '', persone: 2, totale : 0, mancia: 0, quotaxPers: 0});
                        navigation.navigate('loading') }} style={{ justifyContent: 'center', flexDirection: 'row', marginBottom: 0 }}>
                            <Text style={[styles.menuItemText, { paddingVertical: 7 }]}>Ricomincia</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    menuItemText: {
        fontSize: 16,
        color: 'white',
        fontFamily:'Montserrat-Regular'
    },
});

export default Riepilogo;