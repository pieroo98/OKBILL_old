import React, { useState, useEffect } from 'react';
import { ScrollView, Text, View, StyleSheet, TouchableOpacity, TextInput, Keyboard } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

const ModificaPrezzo = ({ onSubmit, prezzo, setPrezzo, itemKey, locked }) => {
    let disabilita;
    if (!itemKey)
        disabilita = false;
    else
        disabilita = locked;
    const handleSubmit = () => {
        if (onSubmit) {
            onSubmit(prezzo);
        }
        Keyboard.dismiss();
    };
    return (
        <TextInput
            placeholder={''}
            placeholderTextColor='#9E9E9E'
            keyboardType="numeric"
            value={prezzo}
            editable={disabilita}
            onChangeText={conto => setPrezzo(String(conto))}
            onSubmitEditing={() => { Keyboard.dismiss(); handleSubmit(); }}
            returnKeyType="send"
            multiline={true}
            textAlignVertical='top'
            style={{ borderColor: itemKey ? '#54d169' : '#858585', minHeight: 61, borderWidth: 1, borderRadius: 50, color: 'white', textAlignVertical: 'auto', textAlign: 'center', fontSize: 24, margin: 20, width: 169, alignSelf: 'center' }}
        />
    );
}

const ModifyByOne = ({ setCambiatoPrezzo, itemState, setItemState, prezzo, setPrezzo, itemTmp, totale }) => {
    let personeTotal = itemState.length;
    let prezzoTotal = parseInt(totale);
    let prezzoSingle = parseFloat(prezzo.toFixed(2));
    let quantiPrezzoBloccato = itemState.filter((i) => i.bloccato).map((i) => i.soldi);
    let prezziBloccati = 0.0;
    for (const c of quantiPrezzoBloccato) {
        prezziBloccati += c;
    }
    let prezzoRestanti = parseFloat(((prezzoTotal - prezzoSingle - prezziBloccati) / (personeTotal - 1 - quantiPrezzoBloccato.length)).toFixed(2));
    setPrezzo(() => String(parseFloat(prezzo.toFixed(2))));

    setItemState(itemState.map((val) => {
        if (val.chiave == itemTmp.chiave) {
            return {
                ...val,
                soldi: prezzoSingle,
            }
        }
        else if (!val.bloccato) {
            return {
                ...val,
                soldi: prezzoRestanti,
            }
        }
        else {
            return {
                ...val,
            }
        }
    }));
    setCambiatoPrezzo(true);
}

const SetupScreen2 = ({ route }) => {
    const [itemTmp, setItemTmp] = useState({ persona: '', chiave: -1, soldi: 0 });
    const [itemKey, setItemKey] = useState(false)
    const [singleKey, setSingleKey] = useState({ chiave: 0, coloreVerde: false });
    const [prezzo, setPrezzo] = useState('0');
    const [finalState, setFinalState] = useState([]);
    const [itemState, setItemState] = useState([]);
    const [cambiatoPrezzo, setCambiatoPrezzo] = useState(false);
    const [locked, setLocked] = useState(false);
    const [personeNuove, setPersoneNuove] = useState(0);
    const [oggettoNuovo, setOggettoNuovo] = useState({ testo: "modifica una quota" });

    const handlePress = (valore) => {
        let esporta = { persona: valore.persona, chiave: valore.chiave, soldi: valore.soldi, bloccato: valore.bloccato };
        setItemTmp(esporta);
        setPrezzo(String(esporta.soldi));
        if (singleKey.chiave == valore.chiave)
            setItemKey(!itemKey);
        else
            setItemKey(true);
        let oggTmp = { chiave: valore.chiave, coloreVerde: singleKey.chiave == valore.chiave ? !singleKey.coloreVerde : true };
        setSingleKey(oggTmp)
        setLocked(valore.bloccato);
    };

    let items = [];


    useEffect(() => {

        let nome = ' quote';
        let cognome = route.params.persona - personeNuove;
        let tmpNome = cognome + nome;
        let tmpOggetto = { persona: tmpNome, soldi: route.params.quotaxPers, chiave: 0, bloccato: false };
        items.push(tmpOggetto);

        setItemState(items);
        setCambiatoPrezzo(true);
    }, [personeNuove]);

    useEffect(() => {
        if (itemKey == false)
            setPrezzo('0');
    }, [itemKey])

    let duepervolta = [];
    let final = [];

    useEffect(() => {
        if (cambiatoPrezzo == true) {
            if (itemState.length % 2 == 0) {
                for (let i = 0; i < itemState.length; i = i + 2) {
                    duepervolta.push(itemState[i]);
                    duepervolta.push(itemState[i + 1]);
                    final.push(duepervolta);
                    duepervolta = [];
                }
                setFinalState(final);
            }
            else {
                let i = 0;
                for (i = 0; i < itemState.length - 2; i = i + 2) {
                    duepervolta.push(itemState[i]);
                    duepervolta.push(itemState[i + 1]);
                    final.push(duepervolta);
                    duepervolta = [];
                }
                duepervolta = itemState[i];
                final.push(duepervolta);
                setFinalState(final);
            }
            setCambiatoPrezzo(false);
        }
    }, [cambiatoPrezzo]);


    const navigation = useNavigation();
    let coloreConto, colorePersone, coloreMancia, coloreTotale, coloreQuota, manciaOpaco;
    coloreConto = colorePersone = coloreMancia = coloreTotale = coloreQuota = 'white';
    if (route.params.conto > 0)
        coloreConto = '#54D169';
    else if (route.params.conto == 0)
        coloreConto = 'white';

    if (route.params.persone > 2)
        colorePersone = '#54D169';
    else if (route.params.persone == 0)
        colorePersone = 'white';

    if (route.params.mancia > 0) {
        coloreMancia = '#54D169';
        manciaOpaco = 1;
    }
    else if (route.params.mancia == 0) {
        coloreMancia = 'white';
        manciaOpaco = 0.5
    }
    if (route.params.totale > 0)
        coloreTotale = '#54D169';
    else if (route.params.totale == 0)
        coloreTotale = 'white';

    if (route.params.quotaxPers > 0)
        coloreQuota = '#54D169';
    else if (route.params.quotaxPers == 0)
        coloreQuota = 'white';
    return (
        <View>
            <ScrollView style={{ backgroundColor: '#121212' }}>
                {finalState.map((item, i) => {
                    if (i == finalState.length) {
                        if (item.length > 1) {
                            return (
                                <>
                                    <View key={item[0].chiave} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, marginTop: 10, marginBottom: 21 }}>
                                        <TouchableOpacity key={item[0].chiave} onPress={() => handlePress(item[0])}>
                                            <View style={{ width: 169, height: 61, backgroundColor: '#1D1D1D', marginRight: 20, marginLeft: 20, borderRadius: 50, borderWidth: 1, borderColor: item[0].bloccato ? 'white' : singleKey.coloreVerde && singleKey.chiave == item[0].chiave ? '#54d169' : '#1D1D1D' }} >
                                                <Text style={{ fontSize: 14, color: 'white', alignSelf: 'center', opacity: item[0].bloccato ? 0.5 : 1 }}>{item[0].persona}</Text>
                                                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                                    <Text style={{ fontSize: 24, color: 'white', alignSelf: 'center', opacity: item[0].bloccato ? 0.5 : 1 }}>{item[0].soldi}</Text>
                                                    <Text style={{ fontSize: 24, color: '#54d169', alignSelf: 'center', opacity: item[0].bloccato ? 0.5 : 1 }}>{' €'}</Text>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                        <TouchableOpacity key={item[1].chiave} onPress={() => handlePress(item[1])}>
                                            <View style={{ width: 169, height: 61, backgroundColor: '#1D1D1D', marginRight: 20, marginLeft: 20, borderRadius: 50, marginBottom: 10, marginTop: 20, borderWidth: 1, borderColor: item[1].bloccato ? 'white' : singleKey.coloreVerde && singleKey.chiave == item[1].chiave ? '#54d169' : '#1D1D1D' }} >
                                                <Text style={{ fontSize: 14, color: 'white', alignSelf: 'center', opacity: item[1].bloccato ? 0.5 : 1 }}>{item[1].persona}</Text>
                                                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                                    <Text style={{ fontSize: 24, color: 'white', alignSelf: 'center', opacity: item[1].bloccato ? 0.5 : 1 }}>{item[1].soldi}</Text>
                                                    <Text style={{ fontSize: 24, color: '#54d169', alignSelf: 'center', opacity: item[1].bloccato ? 0.5 : 1 }}>{' €'}</Text>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                    <View key={item[1].chiave + 1} style={{ flexDirection: 'row', marginBottom: 10, marginTop: 10, marginBottom: 21 }}>
                                        <TouchableOpacity key={item.chiave} onPress={() => handlePress()}>
                                            <View key={i} style={styles.item}>
                                                <View style={{ width: 169, height: 61, backgroundColor: '#1D1D1D', marginTop: 10, borderRadius: 50, marginLeft: 20, marginBottom: 21, borderWidth: 1, borderColor: '#1D1D1D' }}>
                                                    <Text style={{ fontSize: 14, color: 'white', alignSelf: 'center' }}>{oggettoNuovo.testo}</Text>
                                                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                                    <Icon name="plus" size={25} color="#54d169" />
                                                    </View>
                                                </View>
                                            </View>
                                        </TouchableOpacity>
                                    </View>
                                </>
                            )
                        }
                        else {
                            return (
                                <TouchableOpacity key={item.chiave} onPress={() => handlePress(item)}>
                                    <View key={i} style={styles.item}>
                                        <View style={{ width: 169, height: 61, backgroundColor: '#1D1D1D', marginTop: 10, borderRadius: 50, marginLeft: 20, marginBottom: 21, borderWidth: 1, borderColor: item.bloccato ? 'white' : singleKey.coloreVerde && singleKey.chiave == item.chiave ? '#54d169' : '#1D1D1D' }}>
                                            <Text style={{ fontSize: 14, color: 'white', alignSelf: 'center', opacity: item.bloccato ? 0.5 : 1 }}>{item.persona}</Text>
                                            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                                <Text style={{ fontSize: 24, color: 'white', alignSelf: 'center', opacity: item.bloccato ? 0.5 : 1 }}>{item.soldi}</Text>
                                                <Text style={{ fontSize: 24, color: '#54d169', alignSelf: 'center', opacity: item.bloccato ? 0.5 : 1 }}>{' €'}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )
                        }
                    }
                    else {
                        if (item.length > 1) {
                            return (
                                <View key={item[0].chiave} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10, marginTop: 10, marginBottom: 21 }}>
                                    <TouchableOpacity key={item[0].chiave} onPress={() => handlePress(item[0])}>
                                        <View style={{ width: 169, height: 61, backgroundColor: '#1D1D1D', marginRight: 20, marginLeft: 20, borderRadius: 50, borderWidth: 1, borderColor: item[0].bloccato ? 'white' : singleKey.coloreVerde && singleKey.chiave == item[0].chiave ? '#54d169' : '#1D1D1D' }} >
                                            <Text style={{ fontSize: 14, color: 'white', alignSelf: 'center', opacity: item[0].bloccato ? 0.5 : 1 }}>{item[0].persona}</Text>
                                            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                                <Text style={{ fontSize: 24, color: 'white', alignSelf: 'center', opacity: item[0].bloccato ? 0.5 : 1 }}>{item[0].soldi}</Text>
                                                <Text style={{ fontSize: 24, color: '#54d169', alignSelf: 'center', opacity: item[0].bloccato ? 0.5 : 1 }}>{' €'}</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                    <TouchableOpacity key={item[1].chiave} onPress={() => handlePress(item[1])}>
                                        <View style={{ width: 169, height: 61, backgroundColor: '#1D1D1D', marginRight: 20, marginLeft: 20, borderRadius: 50, marginBottom: 10, marginTop: 20, borderWidth: 1, borderColor: item[1].bloccato ? 'white' : singleKey.coloreVerde && singleKey.chiave == item[1].chiave ? '#54d169' : '#1D1D1D' }} >
                                            <Text style={{ fontSize: 14, color: 'white', alignSelf: 'center', opacity: item[1].bloccato ? 0.5 : 1 }}>{item[1].persona}</Text>
                                            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                                <Text style={{ fontSize: 24, color: 'white', alignSelf: 'center', opacity: item[1].bloccato ? 0.5 : 1 }}>{item[1].soldi}</Text>
                                                <Text style={{ fontSize: 24, color: '#54d169', alignSelf: 'center', opacity: item[1].bloccato ? 0.5 : 1 }}>{' €'}</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            )
                        }
                        else {
                            return (
                                <TouchableOpacity key={item.chiave} onPress={() => handlePress(item)}>
                                    <View key={i} style={styles.item}>
                                        <View style={{ width: 169, height: 61, backgroundColor: '#1D1D1D', marginTop: 10, borderRadius: 50, marginLeft: 20, marginBottom: 21, borderWidth: 1, borderColor: item.bloccato ? 'white' : singleKey.coloreVerde && singleKey.chiave == item.chiave ? '#54d169' : '#1D1D1D' }}>
                                            <Text style={{ fontSize: 14, color: 'white', alignSelf: 'center', opacity: item.bloccato ? 0.5 : 1 }}>{item.persona}</Text>
                                            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                                                <Text style={{ fontSize: 24, color: 'white', alignSelf: 'center', opacity: item.bloccato ? 0.5 : 1 }}>{item.soldi}</Text>
                                                <Text style={{ fontSize: 24, color: '#54d169', alignSelf: 'center', opacity: item.bloccato ? 0.5 : 1 }}>{' €'}</Text>
                                            </View>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )
                        }
                    }
                })
                }

                {itemKey ? <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 15 }} >
                    <TouchableOpacity onPress={() => {
                        setLocked(!locked); setItemState(itemState.map((val) => {
                            if (val.chiave == itemTmp.chiave) {
                                return {
                                    ...val,
                                    bloccato: !locked,
                                }
                            }
                            else {
                                return {
                                    ...val,
                                }
                            }
                        })); setCambiatoPrezzo(true);
                    }}>
                        {locked ? <Icon name="lock" size={30} color="#54d169" />
                            :
                            <Icon name="unlock" size={30} color="#54d169" />}
                    </TouchableOpacity>
                </View> :
                    <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 15 }} >
                    </View>}

                <View style={{ flexDirection: 'row', justifyContent: 'center' }} >
                    {itemKey && !locked ? <View style={{ alignContent: 'center', alignSelf: 'center', alignSelf: 'center', justifyContent: 'center' }} >
                        {parseFloat(prezzo) >= 1 ? <TouchableOpacity onPress={() => {
                            ModifyByOne({ setCambiatoPrezzo: setCambiatoPrezzo, itemState: itemState, setItemState: setItemState, prezzo: parseFloat(prezzo) - 1, setPrezzo: setPrezzo, itemTmp: itemTmp, totale: route.params.totale })
                        }} >
                            <Icon name="minus" size={25} color="#54d169" />
                        </TouchableOpacity> :
                            <Icon name="minus" size={25} color="#54d169" />
                        }
                    </View> : false}


                    <ModificaPrezzo onSubmit={prezzo => {
                        if (parseFloat(prezzo) > route.params.totale)
                            ModifyByOne({ setCambiatoPrezzo: setCambiatoPrezzo, itemState: itemState, setItemState: setItemState, prezzo: parseFloat(route.params.totale), setPrezzo: setPrezzo, itemTmp: itemTmp, totale: route.params.totale })
                        else if (parseFloat(prezzo) < 0)
                            ModifyByOne({ setCambiatoPrezzo: setCambiatoPrezzo, itemState: itemState, setItemState: setItemState, prezzo: parseFloat(0), setPrezzo: setPrezzo, itemTmp: itemTmp, totale: route.params.totale })
                        else
                            ModifyByOne({ setCambiatoPrezzo: setCambiatoPrezzo, itemState: itemState, setItemState: setItemState, prezzo: parseFloat(prezzo), setPrezzo: setPrezzo, itemTmp: itemTmp, totale: route.params.totale })
                    }} prezzo={prezzo} setPrezzo={setPrezzo} itemKey={itemKey} locked={!locked} />


                    {itemKey && !locked ? <View style={{ alignContent: 'center', alignSelf: 'center', alignSelf: 'center', justifyContent: 'center' }} >
                        {parseFloat(prezzo) <= (route.params.totale - 1) ? <TouchableOpacity onPress={() => {
                            ModifyByOne({ setCambiatoPrezzo: setCambiatoPrezzo, itemState: itemState, setItemState: setItemState, prezzo: parseFloat(prezzo) + 1, setPrezzo: setPrezzo, itemTmp: itemTmp, totale: route.params.totale })
                        }} >
                            <Icon name="plus" size={25} color="#54d169" />
                        </TouchableOpacity> :
                            <Icon name="plus" size={25} color="#54d169" />
                        }
                    </View> : false}
                </View>

                <View style={{ backgroundColor: '#121212' }}>
                    <View style={[styles.viewPreconto2, { backgroundColor: '#171717' }]}>
                        <View style={styles.viewSinglePreconto2}>
                            <Text style={styles.testoPreconto2}>Conto</Text>
                            <View style={[styles.preconto2, { marginTop: 20, borderColor: coloreConto, backgroundColor: '#171717' }]}>
                                <Text style={{ color: "white", fontSize: 14, }}>{route.params.conto + ' €'}</Text>
                            </View>
                        </View>
                        <View style={styles.viewSinglePreconto2}>
                            <Text style={[styles.testoPreconto2, { marginBottom: 20 }]}>Persone</Text>
                            <View style={[styles.preconto2, { borderColor: colorePersone, backgroundColor: '#171717' }]}>
                                <Text style={{ color: "white", fontSize: 14, }}>{route.params.persone}</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={{ backgroundColor: '#171717' }}>
                    <View style={[styles.viewPreconto2, { backgroundColor: '#1D1D1D' }]}>
                        <View style={styles.viewSinglePreconto2}>
                            <Text style={styles.testoPreconto2}>Mancia</Text>
                            <View style={[styles.preconto2, { marginTop: 20, borderColor: coloreMancia, backgroundColor: '#1D1D1D' }]}>
                                <Text style={{ color: "white", fontSize: 14, opacity: manciaOpaco }}>{route.params.mancia + '%'}</Text>
                            </View>
                        </View>
                        <View style={styles.viewSinglePreconto2}>
                            <Text style={[styles.testoPreconto2, { marginBottom: 20 }]}>Totale</Text>
                            <View style={[styles.preconto2, { borderColor: coloreTotale, backgroundColor: '#1D1D1D' }]}>
                                <Text style={{ color: "white", fontSize: 14, }}>{route.params.totale + '€'}</Text>
                            </View>
                        </View>
                        {/* <View style={styles.viewSinglePreconto2}>
                            <Text style={[styles.testoPreconto2, { marginBottom: 20 }]}>Quota</Text>
                            <View style={[styles.preconto2, { borderColor: coloreQuota, backgroundColor: '#1D1D1D' }]}>
                                <Text style={{ color: "white", fontSize: 14, }}>{route.params.quotaxPers + '€'}</Text>
                            </View>
                        </View> */}
                    </View>
                </View>
                <View style={styles.view2Button}>
                    <View style={[styles.viewButton, { backgroundColor: '#1D1D1D', marginLeft: 20 }]}>
                        <TouchableOpacity onPress={() => navigation.navigate('configure', { conto: route.params.conto })} style={styles.touchButton}>
                            <Text style={styles.menuItemText}>Indietro</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.viewButton, { backgroundColor: '#54d169', marginRight: 20 }]}>
                        <TouchableOpacity onPress={() => navigation.navigate('riepilogo', { conto: route.params.conto, persone: route.params.persone, mancia: route.params.mancia, quotaxPers: route.params.quotaxPers, totale: route.params.totale, items: itemState })} style={styles.touchButton}>
                            <Text style={styles.menuItemText}>Riepilogo</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    row: {
        flexDirection: 'column', justifyContent: 'space-between', marginBottom: 20
    },
    scrollViewContent: {
        flexDirection: 'row',
        marginTop: 30,
    },
    item: {
        width: 169,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#121212',
        margin: 20,
    },
    currentItem: {
        marginTop: 20,
        fontSize: 20,
    },
    viewPreconto2: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20
    },
    viewSinglePreconto2: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    testoPreconto2: {
        color: 'white',
        fontSize: 16,
        alignSelf: 'center',
        marginLeft: 20
    },
    preconto2: {
        borderRadius: 20,
        marginRight: 20,
        marginBottom: 20,
        padding: 2,
        borderWidth: 1,
        width: 67,
        height: 29,
        alignItems: 'center',
    },
    view2Button: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBottom: 30,
        backgroundColor: '#1D1D1D',
        paddingTop: 20
    },
    touchButton: {
        justifyContent: 'center',
        flexDirection: 'row'
    },
    viewButton: {
        width: 127,
        height: 41,
        borderRadius: 20,
        borderColor: '#54d169',
        borderWidth: 1
    },
    menuItemText: {
        fontSize: 16,
        color: 'white',
        paddingVertical: 7
    },
});

export default SetupScreen2;