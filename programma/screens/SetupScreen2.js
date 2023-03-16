import React, { useState, useEffect, useRef } from 'react';
import { ScrollView, Text, View, StyleSheet, TouchableOpacity, TextInput, Keyboard, Dimensions, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import ParametriGenerali from './ParametriGenerali';

const QuotaVuota = ({spazio}) => {
    return (
        <View style={[styles.item, { backgroundColor: '#121212', paddingBottom: 20 }]}>
            <View style={{ width: 169, height: 61, backgroundColor: '#121212', marginTop: 10, borderRadius: 50, marginRight: spazio, marginLeft: spazio, marginBottom: 18 }}>
            </View>
        </View>
    )
}

const GeneralQuote = ({ spazio, item, flag, totale }) => {
    return (
        <View style={{ width: 169, height: 61, backgroundColor: '#1D1D1D', marginRight: spazio, marginLeft: spazio, borderRadius: 50, borderWidth: 1, borderColor: item.bloccato ? 'white' : item.selezionato ? '#54d169' : '#1D1D1D' }} >
            <Text style={{ fontSize: 14, color: 'white', alignSelf: 'center', opacity: item.bloccato ? 0.5 : 1 }}>{item.persona}</Text>
            <View style={{ flexDirection: 'row', justifyContent: flag ? 'space-between' : 'center' }}>
                {flag ? item.soldi - 1 >= 0 ?
                    <TouchableOpacity disabled={item.selezionato && !item.bloccato ? false : true } style={{ paddingHorizontal: 10, }}>
                        <Icon name="minus" size={21} color={item.selezionato ?"#54d169":"white"} />
                    </TouchableOpacity> :
                    <View style={{ paddingHorizontal: 10 }}>
                        <Icon name="minus" size={21} color={item.selezionato ?"#54d169":"white"} />
                    </View>
                    : null}
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 24, color: 'white', alignSelf: 'center', opacity: item.bloccato ? 0.5 : 1 }}>{item.soldi}</Text>
                    <Text style={{ fontSize: 24, color: '#54d169', alignSelf: 'center', opacity: item.bloccato ? 0.5 : 1 }}>{' €'}</Text>
                </View>
                {flag ? item.soldi + 1 <= totale ?
                    <TouchableOpacity disabled={item.selezionato && !item.bloccato ? false : true } style={{ paddingHorizontal: 10 }}>
                        <Icon name="plus" size={21} color={item.selezionato ?"#54d169":"white"} />
                    </TouchableOpacity> :
                    <View style={{ paddingHorizontal: 10 }}>
                        <Icon name="plus" size={21} color={item.selezionato ?"#54d169":"white"} />
                    </View>
                    : null}
            </View>
        </View>
    );
}

const AggiungiQuote = ({ spazio, item, setAddQuota, quoteMod, setQuoteMod, setCliccato }) => {
    const handlePress = () => {
        let esporta = { persona: '1 quota', chiave: item.chiave, soldi: 0, bloccato: false, selezionato: true };
        let prec = quoteMod.map((p) => {
            return {
                ...p,
                selezionato: false,
            }
        })
        prec.push(esporta);
        setQuoteMod(prec);
        setAddQuota(true);
        setCliccato(esporta);
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
    const [cliccato, setCliccato] = useState({persona: '1 quota', chiave: -1, soldi: 0, bloccato: false, selezionato: true });
    const [addQuota, setAddQuota] = useState(true);
    const [due, setDue] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);
    const { width } = Dimensions.get('window');
    const scrollViewRef = useRef();
    const [spazio, setSpazio] = useState(((width - (169 * 2)) / 4));
    const navigation = useNavigation();
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
            if (singoli.length % 4 == 0) {
                for (let i = 0; i < singoli.length; i = i + 4) {
                    duepervolta.push(singoli[i]);
                    duepervolta.push(singoli[i + 1]);
                    duepervolta.push(singoli[i + 2]);
                    duepervolta.push(singoli[i + 3]);
                    final.push(duepervolta);
                    duepervolta = [];
                }
                setFinalState(final);
            }
            else if (singoli.length % 4 == 1) {
                let i = 0;
                for (i = 0; i < singoli.length - 4; i = i + 4) {
                    duepervolta.push(singoli[i]);
                    duepervolta.push(singoli[i + 1]);
                    duepervolta.push(singoli[i + 2]);
                    duepervolta.push(singoli[i + 3]);
                    final.push(duepervolta);
                    duepervolta = [];
                }
                duepervolta = singoli[i];
                final.push(duepervolta);
                setFinalState(final);
            }
            else if (singoli.length % 4 == 2) {
                let i = 0;
                for (i = 0; i < singoli.length - 2; i = i + 4) {
                    duepervolta.push(singoli[i]);
                    duepervolta.push(singoli[i + 1]);
                    duepervolta.push(singoli[i + 2]);
                    duepervolta.push(singoli[i + 3]);
                    final.push(duepervolta);
                    duepervolta = [];
                }
                duepervolta.push(singoli[i]);
                duepervolta.push(singoli[i + 1]);
                final.push(duepervolta);
                setFinalState(final);
            }
            else if (singoli.length % 4 == 3) {
                let i = 0;
                for (i = 0; i < singoli.length - 3; i = i + 4) {
                    duepervolta.push(singoli[i]);
                    duepervolta.push(singoli[i + 1]);
                    duepervolta.push(singoli[i + 2]);
                    duepervolta.push(singoli[i + 3]);
                    final.push(duepervolta);
                    duepervolta = [];
                }
                duepervolta.push(singoli[i]);
                duepervolta.push(singoli[i + 1]);
                duepervolta.push(singoli[i + 2]);
                final.push(duepervolta);
                setFinalState(final);
            }
            setDue(false);
        }
    }, [due])

    const quotaPress = (item) => {
        setSingoli(singoli.map((p) => {
            if (p.chiave === item.chiave) {
                return {
                    ...p,
                    selezionato: true,
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
        setCliccato(item);
    }

    const bloccaQuota = () => {
        setSingoli(singoli.map((p)=>{
            if(p.selezionato){
                setCliccato({persona: p.persona, chiave : p.chiave, soldi: p.soldi,bloccato : !p.bloccato, selezionato : p.selezionato});
                return{
                    ...p,
                    bloccato : !p.bloccato,
                }
            }
            else{
                return{
                    ...p,
                }
            }
        }));
        setDue(true);
    }

    const cancellaQuota = () => {
        setSingoli(singoli.filter((p) => p.chiave !== cliccato.chiave ));
        setQuoteMod(quoteMod.filter((p) => p.chiave !== cliccato.chiave ));
        setDue(true);
    }

    const handleScroll = (event) => {
        const { contentOffset } = event.nativeEvent;
        const currentIndex = Math.round(contentOffset.x / width);
        setActiveIndex(currentIndex);
    };

    const handleDotPress = (index) => {
        setActiveIndex(index);
        scrollViewRef.current.scrollTo({
            x: index * width,
            animated: true,
        });
    };
    
    return (
        <>
            <ScrollView style={{ backgroundColor: '#222222' }}>
                <View style={{ backgroundColor: '#121212', paddingTop: 15 }}>
                    <ScrollView ref={scrollViewRef}
                        onScroll={handleScroll}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.scrollViewContent}
                    >
                        {finalState.map((item) => {
                            if (finalState.length === 1 && item.length === 2) {
                                return (
                                    <View key={item[0].chiave}>
                                        <View style={{ backgroundColor: '#121212', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 29 }}>
                                            <GeneralQuote spazio={spazio} item={item[0]} flag={false} totale={route.params.totale} />
                                            <AggiungiQuote spazio={spazio} item={item[1]} quoteMod={quoteMod} setQuoteMod={setQuoteMod} setAddQuota={setAddQuota} setCliccato={setCliccato} />
                                        </View>
                                        <View style={{ backgroundColor: '#121212', flexDirection: 'row', justifyContent: 'space-between' }}>
                                            <QuotaVuota spazio={spazio}/>
                                            <QuotaVuota spazio={spazio}/>
                                        </View>
                                    </View>
                                )
                            }
                            else {
                                if (item.length === 1 || item.length === undefined) {
                                    return (
                                        <View key={item.chiave} style={{ backgroundColor: '#121212', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 29 }}>
                                            {item.soldi === -1 ?
                                                <AggiungiQuote spazio={spazio} item={item} quoteMod={quoteMod} setQuoteMod={setQuoteMod} setAddQuota={setAddQuota} setCliccato={setCliccato} /> :
                                                item.chiave === 0 ? <GeneralQuote spazio={spazio} item={item} flag={true} totale={route.params.totale} /> :
                                                    <TouchableOpacity disabled={item.selezionato ? true : false} onLongPress={() => quotaPress(item)} >
                                                        <GeneralQuote spazio={spazio} item={item} flag={true} totale={route.params.totale} />
                                                    </TouchableOpacity>}
                                            <QuotaVuota spazio={spazio}/>
                                        </View>
                                    )
                                }
                                else if (item.length === 2) {
                                    return (
                                        <View key={item[0].chiave} style={{ backgroundColor: '#121212', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 29 }}>
                                            <TouchableOpacity disabled={item[0].selezionato ? true : false} onLongPress={() => quotaPress(item[0])} >
                                                <GeneralQuote spazio={spazio} item={item[0]} flag={true} totale={route.params.totale} />
                                            </TouchableOpacity>
                                            {item[1].soldi === -1 ?
                                                <AggiungiQuote spazio={spazio} item={item[1]} quoteMod={quoteMod} setQuoteMod={setQuoteMod} setAddQuota={setAddQuota} setCliccato={setCliccato} /> :
                                                <TouchableOpacity disabled={item[1].selezionato ? true : false} onLongPress={() => quotaPress(item[1])} >
                                                    <GeneralQuote spazio={spazio} item={item[1]} flag={true} totale={route.params.totale} />
                                                </TouchableOpacity>}
                                        </View>
                                    )
                                }
                                else if (item.length === 3) {
                                    return (
                                        <View key={item[0].chiave}>
                                            <View style={{ backgroundColor: '#121212', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 29 }}>
                                                <TouchableOpacity disabled={item[0].selezionato ? true : false} onLongPress={() => quotaPress(item[0])} >
                                                    <GeneralQuote spazio={spazio} item={item[0]} flag={true} totale={route.params.totale} />
                                                </TouchableOpacity>
                                                <TouchableOpacity disabled={item[1].selezionato ? true : false} onLongPress={() => quotaPress(item[1])} >
                                                    <GeneralQuote spazio={spazio} item={item[1]} flag={true} totale={route.params.totale} />
                                                </TouchableOpacity>
                                            </View>
                                            <View style={{ backgroundColor: '#121212', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 29 }}>
                                                {item[2].soldi === -1 ?
                                                    <AggiungiQuote spazio={spazio} item={item[2]} quoteMod={quoteMod} setQuoteMod={setQuoteMod} setAddQuota={setAddQuota} setCliccato={setCliccato} /> :
                                                    <TouchableOpacity disabled={item[2].selezionato ? true : false} onLongPress={() => quotaPress(item[2])} >
                                                        <GeneralQuote spazio={spazio} item={item[2]} flag={true} totale={route.params.totale} />
                                                    </TouchableOpacity>}
                                                <QuotaVuota spazio={spazio}/>
                                            </View>
                                        </View>
                                    )
                                }
                                else if (item.length === 4) {
                                    return (
                                        <View key={item[0].chiave} style={{ marginBottom: item[3].soldi === -1 ? 0 : 27 }}>
                                            <View style={{ backgroundColor: '#121212', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 29 }}>
                                                <TouchableOpacity disabled={item[0].selezionato ? true : false} onLongPress={() => quotaPress(item[0])} >
                                                    <GeneralQuote spazio={spazio} item={item[0]} flag={true} totale={route.params.totale} />
                                                </TouchableOpacity>
                                                <TouchableOpacity disabled={item[1].selezionato ? true : false} onLongPress={() => quotaPress(item[1])} >
                                                    <GeneralQuote spazio={spazio} item={item[1]} flag={true} totale={route.params.totale} />
                                                </TouchableOpacity>
                                            </View>
                                            <View style={{ backgroundColor: '#121212', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 29 }}>
                                                <TouchableOpacity disabled={item[2].selezionato ? true : false} onLongPress={() => quotaPress(item[2])} >
                                                    <GeneralQuote spazio={spazio} item={item[2]} flag={true} totale={route.params.totale} />
                                                </TouchableOpacity>
                                                {item[3].soldi === -1 ?
                                                    <AggiungiQuote spazio={spazio} item={item[3]} quoteMod={quoteMod} setQuoteMod={setQuoteMod} setAddQuota={setAddQuota} setCliccato={setCliccato} /> :
                                                    <TouchableOpacity disabled={item[3].selezionato ? true : false} onLongPress={() => quotaPress(item[3])} >
                                                        <GeneralQuote spazio={spazio} item={item[3]} flag={true} totale={route.params.totale} />
                                                    </TouchableOpacity>}
                                            </View>
                                        </View>
                                    )
                                }
                            }
                        })}
                    </ScrollView>
                    <View style={[styles.pagination, { marginTop: 30 }]}>
                        {finalState.map((_, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.dot,
                                    activeIndex === index && styles.activeDot,
                                ]}
                                onPress={() => handleDotPress(index)}
                            />
                        ))}
                    </View>
                </View>

                <View style={{ backgroundColor: '#121212' }}>
                    <View style={[styles.viewPreconto2, { backgroundColor: '#171717', paddingTop: 20, flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 30, }]}>
                        <View style={[styles.viewButton2, { backgroundColor: 'red', marginLeft: 20, borderColor: 'red', opacity:quoteMod.length===0 || finalState[0][0].selezionato ? 0.5 : 1 }]}>
                            <TouchableOpacity disabled={cliccato.chiave===0 || quoteMod.length===0  ? true : false} onPress={() => { cancellaQuota()}} style={styles.touchButton}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }} >
                                    <Icon name='trash-o' size={21} color='white' />
                                    <Text style={styles.menuItemText}> Elimina quota</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.viewButton2, { backgroundColor: '#54d169', marginRight: 20, opacity:quoteMod.length===0 ? 0.5 : 1 }]}>
                            <TouchableOpacity disabled={quoteMod.length===0? true : false} onPress={() => { bloccaQuota() }} style={styles.touchButton}>
                                {!cliccato.bloccato ? <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }} >
                                    <Icon name='lock' size={21} color='white' />
                                    <Text style={styles.menuItemText}> Blocca quota</Text>
                                </View> : 
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }} >
                                <Icon name='unlock' size={21} color='white' />
                                <Text style={styles.menuItemText}> Sblocca quota</Text>
                            </View>}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                <ParametriGenerali conto={route.params.conto} persone={route.params.persone} mancia={route.params.mancia} totale={route.params.totale} />

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
                            <TouchableOpacity onPress={() => navigation.navigate('riepilogo', { conto: route.params.conto, persone: route.params.persone, mancia: route.params.mancia, quotaxPers: route.params.quotaxPers, totale: route.params.totale, items: singoli })} style={styles.touchButton}>
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
    pagination: {
        position: 'absolute',
        bottom: 14,
        left: 0,
        right: 0,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'white',
        marginHorizontal: 4,
    },
    activeDot: {
        backgroundColor: '#54d169',
    },
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
    viewButton2: {
        width: 150,
        height: 41,
        borderRadius: 20,
        borderColor: '#54d169',
        borderWidth: 1
    }
});

export default SetupScreen2;