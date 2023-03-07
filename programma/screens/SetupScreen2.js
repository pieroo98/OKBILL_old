import React, { useState, useEffect } from 'react';
import { ScrollView, Text, View, StyleSheet, TouchableOpacity, TextInput, Keyboard, Dimensions, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

const GeneralQuote = ({ spazio, item, flag, totale }) => {
    return (
        <View style={{ width: 169, height: 61, backgroundColor: '#1D1D1D', marginRight: spazio, marginLeft: spazio, borderRadius: 50, borderWidth: 1, borderColor: item.bloccato ? 'white' : item.selezionato ? '#54d169' : '#1D1D1D' }} >
            <Text style={{ fontSize: 14, color: 'white', alignSelf: 'center', opacity: item.bloccato ? 0.5 : 1 }}>{item.persona}</Text>
            <View style={{ flexDirection: 'row', justifyContent: flag ? 'space-between' : 'center' }}>
                {flag ? item.soldi - 1 >= 0 ?
                    <TouchableOpacity style={{ paddingHorizontal: 10 }}>
                        <Icon name="minus" size={21} color="white" />
                    </TouchableOpacity> :
                    <View style={{ paddingHorizontal: 10 }}>
                        <Icon name="minus" size={21} color="white" />
                    </View>
                    : null}
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 24, color: 'white', alignSelf: 'center', opacity: item.bloccato ? 0.5 : 1 }}>{item.soldi}</Text>
                    <Text style={{ fontSize: 24, color: '#54d169', alignSelf: 'center', opacity: item.bloccato ? 0.5 : 1 }}>{' €'}</Text>
                </View>
                {flag ? item.soldi + 1 <= totale ?
                    <TouchableOpacity style={{ paddingHorizontal: 10 }}>
                        <Icon name="plus" size={21} color="white" />
                    </TouchableOpacity> :
                    <View style={{ paddingHorizontal: 10 }}>
                        <Icon name="plus" size={21} color="white" />
                    </View>
                    : null}
            </View>
        </View>
    );
}

const AggiungiQuote = ({ spazio, item, setAddQuota, quoteMod, setQuoteMod }) => {
    const handlePress = () => {
        let esporta = { persona: '1 quota', chiave: item.chiave, soldi: 0, bloccato: false, selezionato: false };
        let prec = quoteMod;
        prec.push(esporta);
        setQuoteMod(prec);
        setAddQuota(true);
    };

    return (
        <TouchableOpacity onPress={() => { handlePress() }}>
            <View style={[styles.item, { backgroundColor: '#121212', paddingBottom: 20 }]}>
                <View style={{ width: 169, height: 61, backgroundColor: '#121212', marginTop: 10, borderRadius: 50, marginRight: spazio, marginLeft: spazio, marginBottom: 18, borderWidth: 1, borderColor: '#1D1D1D', }}>
                    <Text style={{ fontSize: 14, color: 'white', alignSelf: 'center', paddingTop: 2, opacity: item.bloccato ? 0.5 : 1 }}>{item.persona}</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', paddingTop: 4 }}>
                        <Icon name="plus" size={25} color="#54d169" />
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const SetupScreen2 = ({ route }) => {
    const [singoli, setSingoli] = useState([]);
    const [finalState, setFinalState] = useState([]);
    const [quoteMod, setQuoteMod] = useState([]);
    const [addQuota, setAddQuota] = useState(true);
    const [due, setDue] = useState(false);
    const { width } = Dimensions.get('window');
    const [spazio, setSpazio] = useState(((width - (169 * 2)) / 4));
    let items = [];
    let nomi = ' quote';
    let nome = ' quota';
    let cognome = 0;
    let final = [];
    let duepervolta = [];

    useEffect(() => {
        if (addQuota) {
            let aggiunte = quoteMod.length;
            cognome = route.params.persone - aggiunte;
            let tmp = { persona: cognome > 1 ? String(cognome).concat(nomi) : String(cognome).concat(nome), soldi: route.params.quotaxPers, bloccato: false, chiave: 0, selezionato: false }
            items.push(tmp);
            if (aggiunte > 0) {
                for (const c1 of quoteMod) {
                    items.push(c1);
                }
            }
            let bottoneAdd = { persona: 'modifica una quota', soldi: -1, bloccato: false, chiave: parseInt(aggiunte) + 1, selezionato: false };
            if (cognome > 1)
                items.push(bottoneAdd);
            setSingoli(items);
            setAddQuota(false);
            setDue(true);
        }
    }, [addQuota])


    useEffect(() => {
        if (due) {
            if (singoli.length % 2 == 0) {
                for (let i = 0; i < singoli.length; i = i + 2) {
                    duepervolta.push(singoli[i]);
                    duepervolta.push(singoli[i + 1]);
                    final.push(duepervolta);
                    duepervolta = [];
                }
                setFinalState(final);
            }
            else {
                let i = 0;
                for (i = 0; i < singoli.length - 2; i = i + 2) {
                    duepervolta.push(singoli[i]);
                    duepervolta.push(singoli[i + 1]);
                    final.push(duepervolta);
                    duepervolta = [];
                }
                duepervolta = singoli[i];
                final.push(duepervolta);
                setFinalState(final);
                duepervolta = [];
            }
            setDue(false);
        }
    }, [due])

    const quotaPress = (item) => {
        setSingoli(singoli.map((p) => {
            if (p.chiave === item.chiave) {
                return {
                    ...p,
                    selezionato: !item.selezionato,
                }
            }
            else {
                return {
                    ...p,
                    selezionato: false,
                }
            }
        }));
        setDue(true);
    }

    const bloccaQuota = (item) => {
        console.log(item);
    }

    const cancellaQuota = (item) => {
        console.log(item);
    }

    const navigation = useNavigation();
    let coloreConto, colorePersone, coloreMancia, coloreTotale, manciaOpaco;
    coloreConto = colorePersone = coloreMancia = coloreTotale = 'white';
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

    return (
        <>
            <ScrollView style={{ backgroundColor: '#222222' }}>
                <View style={{ backgroundColor: '#121212', paddingTop: 15 }}>
                    <ScrollView style={styles.scrollViewContent} >
                        {finalState.map((item) => {
                            if (finalState.length === 1) {
                                return (
                                    <View key={item[0].chiave} style={{ backgroundColor: '#121212', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 29 }}>
                                        <GeneralQuote spazio={spazio} item={item[0]} flag={false} totale={route.params.totale} />
                                        <AggiungiQuote spazio={spazio} item={item[1]} quoteMod={quoteMod} setQuoteMod={setQuoteMod} setAddQuota={setAddQuota} />
                                    </View>
                                )
                            }
                            else {
                                if (item.length === 2) {
                                    return (
                                        <View key={item[0].chiave} >
                                            {item[0].selezionato ?
                                                <View style={{ backgroundColor: '#121212', flexDirection: 'row', marginBottom: 10, marginTop: -20 }}>
                                                    <TouchableOpacity onPress={() => cancellaQuota(item[0])} style={{marginLeft: spazio+ 169/2 - 20}} >
                                                        <Icon name="trash-o" size={21} color="red" />
                                                    </TouchableOpacity>
                                                    <TouchableOpacity onPress={() => bloccaQuota(item[0])} style={{marginLeft: + 15}}>
                                                        <Icon name="lock" size={21} color="green" />
                                                    </TouchableOpacity>
                                                </View> : null}
                                            <View style={{ backgroundColor: '#121212', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 29 }}>
                                                {item[0].chiave === 0 ? <GeneralQuote spazio={spazio} item={item[0]} flag={true} totale={route.params.totale} /> :
                                                    <TouchableOpacity onLongPress={() => quotaPress(item[0])} >
                                                        <GeneralQuote spazio={spazio} item={item[0]} flag={true} totale={route.params.totale} />
                                                    </TouchableOpacity>}
                                                {item[1].soldi === -1 ?
                                                    <AggiungiQuote spazio={spazio} item={item[1]} quoteMod={quoteMod} setQuoteMod={setQuoteMod} setAddQuota={setAddQuota} /> :
                                                    item[1].chiave === 0 ? <GeneralQuote spazio={spazio} item={item[1]} flag={true} totale={route.params.totale} /> :
                                                        <TouchableOpacity onLongPress={() => quotaPress(item[1])} >
                                                            <GeneralQuote spazio={spazio} item={item[1]} flag={true} totale={route.params.totale} />
                                                        </TouchableOpacity>}
                                            </View>
                                        </View>
                                    )
                                }
                                else {
                                    return (
                                        <View key={item.chiave} style={{ backgroundColor: '#121212', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 29 }}>
                                            {item.soldi === -1 ?
                                                <AggiungiQuote spazio={spazio} item={item} quoteMod={quoteMod} setQuoteMod={setQuoteMod} setAddQuota={setAddQuota} /> :
                                                item.chiave === 0 ? <GeneralQuote spazio={spazio} item={item} flag={true} totale={route.params.totale} /> :
                                                    <TouchableOpacity onLongPress={() => quotaPress(item)} >
                                                        <GeneralQuote spazio={spazio} item={item} flag={true} totale={route.params.totale} />
                                                    </TouchableOpacity>}
                                            <View style={[styles.item, { backgroundColor: '#121212', paddingBottom: 20 }]}>
                                                <View style={{ width: 169, height: 61, backgroundColor: '#121212', marginTop: 10, borderRadius: 50, marginRight: spazio, marginLeft: spazio, marginBottom: 18 }}>
                                                </View>
                                            </View>
                                        </View>
                                    )
                                }
                            }
                        })}
                    </ScrollView>
                </View>

                <View style={{ backgroundColor: '#121212' }}>
                    <View style={[styles.viewPreconto2, { backgroundColor: '#1D1D1D' }]}>
                        <View style={styles.viewSinglePreconto2}>
                            <Text style={styles.testoPreconto2}>Conto</Text>
                            <View style={[styles.preconto2, { marginTop: 20, borderColor: coloreConto, backgroundColor: '#1D1D1D' }]}>
                                <Text style={{ color: "white", fontSize: 14, }}>{route.params.conto + ' €'}</Text>
                            </View>
                        </View>
                        <View style={styles.viewSinglePreconto2}>
                            <Text style={[styles.testoPreconto2, { marginBottom: 20 }]}>Persone</Text>
                            <View style={[styles.preconto2, { borderColor: colorePersone, backgroundColor: '#1D1D1D' }]}>
                                <Text style={{ color: "white", fontSize: 14, }}>{route.params.persone}</Text>
                            </View>
                        </View>
                    </View>
                </View>
                <View style={{ backgroundColor: '#1D1D1D' }}>
                    <View style={[styles.viewPreconto2, { backgroundColor: '#222222' }]}>
                        <View style={styles.viewSinglePreconto2}>
                            <Text style={styles.testoPreconto2}>Mancia</Text>
                            <View style={[styles.preconto2, { marginTop: 20, borderColor: coloreMancia, backgroundColor: '#222222' }]}>
                                <Text style={{ color: "white", fontSize: 14, opacity: manciaOpaco }}>{route.params.mancia + '%'}</Text>
                            </View>
                        </View>
                        <View style={styles.viewSinglePreconto2}>
                            <Text style={[styles.testoPreconto2, { marginBottom: 20 }]}>Totale</Text>
                            <View style={[styles.preconto2, { borderColor: coloreTotale, backgroundColor: '#222222' }]}>
                                <Text style={{ color: "white", fontSize: 14, }}>{route.params.totale + '€'}</Text>
                            </View>
                        </View>
                    </View>
                </View>

            </ScrollView>
            <View style={{ backgroundColor: '#222222' }} >
                <View style={{ backgroundColor: '#222222', paddingTop: 20 }} >
                    <View style={styles.view2Button}>
                        <View style={[styles.viewButton, { backgroundColor: '#222222', marginLeft: 20 }]}>
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
                </View>
            </View>
        </>
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
        marginBottom: 30,
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