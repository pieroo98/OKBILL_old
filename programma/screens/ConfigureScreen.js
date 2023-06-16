import React, { useEffect, useState } from 'react';
import { Text, StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Slider from '@react-native-community/slider';

const vett = [{ val: 0, press: false }, { val: 5, press: false }, { val: 10, press: false }, { val: 15, press: false }, { val: 20, press: false }];

const len7 = 90;
const len5 = 67;
const len9 = 118;

const ConfigureScreen = ({ route }) => {
    const navigation = useNavigation();
    const [conto, setConto] = useState(parseFloat(route.params.conto).toFixed(2));
    const [persone, setPersone] = useState(2);
    const [mancia, setMancia] = useState(0);
    const [totale, setTotale] = useState(parseFloat(route.params.conto).toFixed(2));
    const [quotaxPers, setQuotaxPers] = useState(parseFloat(totale/persone).toFixed(2));
    const [isSubmittedLoading, setIsSubmittedLoading] = useState(false);
    const [isSubmittedSetup, setIsSubmittedSetup] = useState(false);
    let coloreConto, colorePersone, coloreMancia, coloreTotale, coloreQuota, manciaOpaco;
    coloreConto = colorePersone = coloreMancia = coloreTotale = coloreQuota = 'white';
    if (conto > 0)
        coloreConto = '#54D169';
    else if (conto == 0)
        coloreConto = 'white';

    if (persone > 2)
        colorePersone = '#54D169';
    else if (persone == 0)
        colorePersone = 'white';

    if (mancia > 0) {
        coloreMancia = '#54D169';
        manciaOpaco = 1;
    }
    else if (mancia == 0) {
        coloreMancia = 'white';
        manciaOpaco = 0.5
    }
    if (totale > 0)
        coloreTotale = '#54D169';
    else if (totale == 0)
        coloreTotale = 'white';

    if (quotaxPers > 0)
        coloreQuota = '#54D169';
    else if (quotaxPers == 0)
        coloreQuota = 'white';

    const [vettFilter, setVettFilter] = useState(vett);
    const [signleButton, setSingleButton] = useState({ val: 0, press: true });
    const [cliccato, setCliccato] = useState(true);

    useEffect(() => {
        if (cliccato) {
            setVettFilter(vettFilter.map(p => {
                if (p.val == signleButton.val) {
                    return {
                        ...p,
                        press: signleButton.press,
                    }
                }
                else {
                    return {
                        ...p,
                        press: false,
                    }
                }
            }));
            setCliccato(false);
        }
    }, [cliccato]);

    const handlePress = (item) => {
        if (signleButton.val != item.val) {
            setSingleButton({ val: item.val, press: true });
            setMancia(item.val);
        }
        else {
            setSingleButton({ val: item.val, press: !signleButton.press });
            setMancia(!signleButton.press ? item.val : 0);
        }
        setCliccato(true);
        let aggiunta = 0;
        if (item.val > 0) {
            if (conto > 0) {
                aggiunta = parseFloat((item.val / 100) * conto);
                const fin = parseFloat(conto) + parseFloat(aggiunta);
                setTotale(fin.toFixed(2));
                const numero = fin / persone;
                setQuotaxPers(parseFloat(numero.toFixed(2)));
            }
        }
        else {
            setTotale(conto);
            const numero = conto / persone;
            setQuotaxPers(parseFloat(numero.toFixed(2)));
        }
        if (!item.press == false) {
            setTotale(conto);
            const numero = conto / persone;
            setQuotaxPers(parseFloat(numero.toFixed(2)));
        }
    };

    const handleValueChange = (newValue) => {
        setPersone(Math.round(newValue));
        let aggiunta = 0;
        if (mancia > 0) {
            if (conto > 0) {
                aggiunta = parseFloat((parseFloat(conto) * mancia) / 100);
                const numero = (parseFloat(conto) + aggiunta) / Math.round(newValue);
                setQuotaxPers(parseFloat(numero.toFixed(2)));
            }
            else
                setQuotaxPers(0);
        }
        else {
            if (conto > 0) {
                const numero = conto / Math.round(newValue);
                setQuotaxPers(parseFloat(numero.toFixed(2)));
            }
            else
                setQuotaxPers(0);
        }
    };

    const toggleIsSubmittedLoading = () => {
        setIsSubmittedLoading(value => !value);
      };
    
    useEffect(() => {
    if (isSubmittedLoading === true) {
        navigation.navigate('loading');
    }
    }, [isSubmittedLoading]);

    const toggleIsSubmittedSetup = () => {
        setIsSubmittedSetup(value => !value);
      };
    
    useEffect(() => {
    if (isSubmittedSetup === true) {
        navigation.navigate('setup', { conto: route.params.conto, persone: persone, mancia: mancia, quotaxPers: quotaxPers, totale: totale });   
    }
    }, [isSubmittedSetup]);

    return (
        <>
            <ScrollView style={{ backgroundColor: '#222222' }}  >
                <View style={{ backgroundColor: '#121212' }} >
                    <Text style={styles.didascalia} >{"Inserisci l’importo e dividi la \nquota con i tuoi amici"}</Text>
                </View>
                <View style={{ backgroundColor: '#121212' }} >
                    <View style={{ borderTopLeftRadius: 20, borderTopRightRadius: 20, backgroundColor: '#171717' }}>
                        <View style={styles.rigeSeparate}>
                            <Text style={styles.parola}>Conto</Text>
                            <View style={[styles.valore, { backgroundColor: '#171717', marginTop: 20, marginBottom: 13, borderColor: coloreConto, width: conto.toString().length <=5 ? len5: conto.toString().length<8 ? len7: len9, }]} >
                                <Text style={{ color: "white", fontSize: 14, fontFamily:'Montserrat-Regular' }} >{conto + '€'}</Text>
                            </View>
                        </View>
                        <View style={styles.rigeSeparate}>
                            <Text style={[styles.parola, { marginBottom: 20 }]}>Persone</Text>
                            <View style={[styles.valore, { backgroundColor: '#171717', marginBottom: 20, borderColor: colorePersone, width: conto.toString().length<=5 ? len5: conto.toString().length<8 ? len7: len9, }]} >
                                <Text style={{ color: "white", fontSize: 14,  fontFamily:'Montserrat-Regular'}} >{persone}</Text>
                            </View>
                        </View>
                    </View>
                </View>

                <View style={{ backgroundColor: '#171717', }} >
                    <View style={{ borderTopLeftRadius: 20, borderTopRightRadius: 20, backgroundColor: '#1D1D1D' }}>
                        <View style={styles.rigeSeparate}>
                            <Text style={styles.parola}>Mancia</Text>
                            <View style={[styles.valore, { backgroundColor: '#1D1D1D', marginTop: 20, marginBottom: 20, borderColor: coloreMancia, width: conto.toString().length<=5 ? len5: conto.toString().length<8 ? len7: len9, }]} >
                                <Text style={{ color: "white", fontSize: 14, opacity: manciaOpaco, fontFamily:'Montserrat-Regular' }} >{mancia + '%'}</Text>
                            </View>
                        </View>
                        <View style={styles.rigeSeparate}>
                            <Text style={[styles.parola, { marginBottom: 20 }]}>Totale</Text>
                            <View style={[styles.valore, { backgroundColor: '#1D1D1D', marginBottom: 20, borderColor: coloreTotale, width: conto.toString().length<=5 ? len5: conto.toString().length<8 ? len7: len9, }]} >
                                <Text style={{ color: "white", fontSize: 14, fontFamily:'Montserrat-Regular' }} >{totale + '€'}</Text>
                            </View>
                        </View>
                        <View style={styles.rigeSeparate}>
                            <Text style={[styles.parola, { marginBottom: 20 }]}>Quota</Text>
                            <View style={[styles.valore, { backgroundColor: '#1D1D1D', marginBottom: 20, borderColor: coloreQuota, width: conto.toString().length<=5 ? len5: conto.toString().length<8 ? len7: len9, }]} >
                                <Text style={{ color: "white", fontSize: 14, fontFamily:'Montserrat-Regular' }} >{quotaxPers + '€'}</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={{ backgroundColor: '#1D1D1D' }} >
                    <View style={{ borderTopLeftRadius: 14, borderTopRightRadius: 14, backgroundColor: '#222222', }}>
                        <Text style={{ marginBottom: 10, marginTop: 20, color: 'white', fontSize: 16, marginLeft: 20, fontFamily:'Montserrat-Regular' }}>Numero di persone</Text>
                        <Slider
                            minimumValue={2}
                            maximumValue={20}
                            minimumTrackTintColor="#54D169"
                            maximumTrackTintColor="#fff"
                            thumbTintColor="#54D169"
                            value={persone}
                            onValueChange={handleValueChange}
                            style={{ width: '100%', fontFamily:'Montserrat-Regular' }}
                            tapToSeek='true'
                        />
                        <View style={styles.rigeSeparate}>
                            <Text style={{ color: 'white', fontSize: 12, marginLeft: 17, fontFamily:'Montserrat-Regular' }}>2</Text>
                            <Text style={{ color: 'white', fontSize: 12, marginRight: 15, fontFamily:'Montserrat-Regular' }}>20</Text>
                        </View>
                        <Text style={{ marginBottom: 20, marginTop: 5, color: 'white', fontSize: 16, marginLeft: 20, fontFamily:'Montserrat-Regular' }}>Mancia</Text>
                        <View style={[styles.container2, { paddingBottom: 15 }]}>
                            {vettFilter.map((item, i) => {
                                return (
                                    <TouchableOpacity onPress={() => handlePress(item)} key={i}>
                                        <View
                                            style={{
                                                backgroundColor: item.press ? '#54D169' : '#404040',
                                                borderRadius: 25, width: 50,
                                                height: 50, alignItems: 'center',
                                                justifyContent: 'center',
                                                borderWidth: 1, borderColor: 'white'
                                            }}>
                                            <Text style={{ color: 'white', fontSize: 14, fontFamily:'Montserrat-Regular' }}>
                                                {item.val}%
                                            </Text>
                                        </View>
                                    </TouchableOpacity>
                                );
                            }
                            )}
                        </View>
                    </View>
                </View>

            </ScrollView>
            <View style={{ backgroundColor: '#222222' }} >
                <View style={[styles.rigeSeparate, { marginBottom: 30, backgroundColor: '#222222', paddingTop: 20 }]} >
                    <View style={[styles.formaBottone, { backgroundColor: '#222222', marginLeft: 20 }]}>
                        <TouchableOpacity onPress={toggleIsSubmittedLoading} style={styles.posizioneBottone}>
                            <Text style={styles.menuItemText}>Indietro</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.formaBottone, { backgroundColor: '#54d169', marginRight: 20 }]}>
                        <TouchableOpacity onPress={toggleIsSubmittedSetup} style={styles.posizioneBottone} >
                            <Text style={styles.menuItemText}>Calcola</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    didascalia: {
        fontSize: 16,
        color: 'white',
        textAlign: 'center',
        marginBottom: 25,
        marginTop: 25,
        fontFamily:'Montserrat-Regular'
    }
    , valore: {
        borderRadius: 20,
        marginRight: 20,
        padding: 2,
        borderWidth: 1,
        height: 29,
        alignItems: 'center',
        paddingVertical: 4
    },
    parola: {
        color: 'white',
        fontSize: 16,
        alignSelf: 'center',
        marginLeft: 20,
        fontFamily:'Montserrat-Regular'
    },
    rigeSeparate: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    posizioneBottone: {
        justifyContent: 'center',
        flexDirection: 'row'
    },
    formaBottone: {
        width: 127,
        height: 41,
        borderRadius: 20,
        borderColor: '#54d169',
        borderWidth: 1
    },
    menuItemText: {
        fontSize: 16,
        color: 'white',
        paddingVertical: 7,
        fontFamily:'Montserrat-Regular'
    },
    container2: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        marginBottom: 30,
    }
});

export default ConfigureScreen;