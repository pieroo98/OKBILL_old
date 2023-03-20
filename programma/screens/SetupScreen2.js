import React, { useState, useEffect, useRef } from 'react';
import { ScrollView, Text, View, StyleSheet, TouchableOpacity, TextInput, Keyboard, Dimensions, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import ParametriGenerali from './ParametriGenerali';

const ModQuota =({item, valore, singoli, setSingoli, quoteMod, setQuoteMod, setDue, totale, persone}) => {
    let quantePersone = parseInt(item.persona.split(" ")[0]);
    let quantiPrezzoBloccato = singoli.filter((i) => i.bloccato);
    let prezziBloccati = 0.0, personeBloccate =0;
    for (const c of quantiPrezzoBloccato) {
        prezziBloccati += parseFloat(c.soldi)*parseInt(c.persona.split(" ")[0]);
        personeBloccate += parseInt(c.persona.split(" ")[0]);
    }
    let denominatore = parseInt(persone) - quantePersone - personeBloccate;
    let numeratore = parseFloat(totale) - parseFloat(valore)*quantePersone - prezziBloccati;
    let prezzoRestanti=0;
    if(denominatore!==0 && numeratore>=0){
        prezzoRestanti = parseFloat(((numeratore) / (denominatore)).toFixed(2));
        setSingoli(singoli.map((p)=>{
            if(p.chiave===item.chiave){
                return{
                    ...p,
                    soldi : valore.toFixed(2),
                }
            }
            else if (!p.bloccato && p.soldi!==-1){
                return{
                    ...p,
                    soldi: prezzoRestanti,
                }
            }
            else{
                return{
                    ...p
                }
            }
        }));
        setQuoteMod(quoteMod.map((p)=>{
            if(p.chiave===item.chiave){
                return{
                    ...p,
                    soldi : valore.toFixed(2),
                }
            }
            else if (!p.bloccato ){
                return{
                    ...p,
                    soldi: prezzoRestanti,
                }
            }
            else{
                return{
                    ...p
                }
            }
        }));
        setDue(true)
    }
    else{
        console.log("non puoi modificare la quota, sblocca prima una quota bloccata!");
        if(denominatore===0){
            Alert.alert(
            'Attenzione',
            'non puoi modificare la quota, sblocca prima una quota bloccata!',
            [
              { text: 'OK', onPress: () => {} },
            ]
          );
        }
        else if(numeratore<0){
            Alert.alert(
                'Attenzione',
                'non puoi modificare la quota, supereresti il conto totale!',
                [
                  { text: 'OK', onPress: () => {} },
                ]
              );
        }
    }
}

const QuotaVuota = ({spazio}) => {
    return (
        <View style={[styles.item, { backgroundColor: '#121212', paddingBottom: 20 }]}>
            <View style={{ width: 169, height: 61, backgroundColor: '#121212', marginTop: 10, borderRadius: 50, marginRight: spazio, marginLeft: spazio, marginBottom: 18 }}>
            </View>
        </View>
    )
}

const GeneralQuote = ({ spazio, item, flag, totale, singoli, setSingoli, quoteMod, setQuoteMod, setDue, persone }) => {
    return (
        <View style={{ width: 169, height: 61, backgroundColor: '#1D1D1D', marginRight: spazio, marginLeft: spazio, borderRadius: 50, borderWidth: 1, borderColor: item.selezionato ? '#54d169' : item.bloccato ? 'white' : '#1D1D1D' }} >
            <Text style={{ fontSize: 14, color: 'white', alignSelf: 'center', opacity: item.bloccato ? 0.5 : 1 }}>{item.persona}</Text>
            <View style={{ flexDirection: 'row', justifyContent: flag ? 'space-between' : 'center' }}>
                {flag ? item.soldi - 1 >= 0 ?
                    <TouchableOpacity disabled={item.selezionato && !item.bloccato ? false : true } style={{ paddingHorizontal: 10,opacity: item.bloccato ? 0.5 : 1 }} onPress={()=>{ModQuota({item:item, valore:parseFloat(item.soldi)-1, singoli:singoli, setSingoli:setSingoli, quoteMod:quoteMod, setQuoteMod: setQuoteMod, setDue:setDue, totale: totale, persone: persone})}} >
                        <Icon name="minus" size={21} color={item.bloccato ?"white" : item.selezionato ? "#54d169": "white"} />
                    </TouchableOpacity> :
                    <View style={{ paddingHorizontal: 10, opacity: item.bloccato ? 0.5 : 1 }}>
                        <Icon name="minus" size={21} color={item.bloccato ?"white" : item.selezionato ? "#54d169": "white"} />
                    </View>
                    : null}
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                    <Text style={{ fontSize: 24, color: 'white', alignSelf: 'center', opacity: item.bloccato ? 0.5 : 1 }}>{item.soldi}</Text>
                    <Text style={{ fontSize: 24, color: '#54d169', alignSelf: 'center', opacity: item.bloccato ? 0.5 : 1 }}>{' €'}</Text>
                </View>
                {flag ? item.soldi + 1 <= totale ?
                    <TouchableOpacity disabled={item.selezionato && !item.bloccato ? false : true } style={{ paddingHorizontal: 10, opacity: item.bloccato ? 0.5 : 1 }} onPress={()=>{ModQuota({item:item, valore:parseFloat(item.soldi)+1, singoli:singoli, setSingoli:setSingoli, quoteMod:quoteMod, setQuoteMod: setQuoteMod, setDue:setDue, totale: totale, persone: persone})}} >
                        <Icon name="plus" size={21} color={item.bloccato ?"white" : item.selezionato ? "#54d169": "white"} />
                    </TouchableOpacity> :
                    <View style={{ paddingHorizontal: 10, opacity: item.bloccato ? 0.5 : 1 }}>
                        <Icon name="plus" size={21} color={item.bloccato ?"white" : item.selezionato ? "#54d169": "white"} />
                    </View>
                    : null}
            </View>
        </View>
    );
}

const AggiungiQuote = ({ spazio, item, setAddQuota, quoteMod, setQuoteMod, setCliccato, singoli, setSingoli, totale, persone }) => {
    const handlePress = () => {
        if(singoli[0].bloccato){
            Alert.alert(
                'Attenzione',
                "non puoi aggiungere un'altra quota, sblocca prima la quota bloccata con più quote!",
                [
                  { text: 'OK', onPress: () => {} },
                ]
              );
        }
        else{
            let quantiPrezzoBloccato = singoli.filter((i) => i.bloccato);
            let prezziBloccati = 0.0;
            let personeBloccate =0, denominatore = 0, numeratore=0, prezzoRestanti=0;
            for (const c of quantiPrezzoBloccato) {
                prezziBloccati += parseFloat(c.soldi)*parseInt(c.persona.split(" ")[0]);
                personeBloccate += parseInt(c.persona.split(" ")[0]);
            }
            
            denominatore = parseInt(persone) - personeBloccate;
            numeratore = parseFloat(totale) - prezziBloccati;
            if(denominatore>0 && numeratore>=0){
                prezzoRestanti = parseFloat(((numeratore) / (denominatore)).toFixed(2));
            }
            
            let esporta = { persona: '1 quota', chiave: item.chiave, soldi: prezzoRestanti, bloccato: false, selezionato: true };
            let prec = quoteMod.map((p) => {
                if(p.bloccato){
                    return {
                    ...p,
                    selezionato: false,
                    }
                }
                else{
                    return {
                        ...p,
                        selezionato: false,
                        soldi: prezzoRestanti,
                    }
                }
            })
            prec.push(esporta);
            setQuoteMod(prec);
            setSingoli(singoli.map((p)=>{
                if(p.bloccato){
                    return {
                    ...p,
                    selezionato: false,
                    }
                }
                else{
                    return {
                        ...p,
                        selezionato: false,
                        soldi: prezzoRestanti,
                    }
                }
            }))
            setAddQuota(true);
            setCliccato(esporta);
        }
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

function cancellaQuota({singoli, totale, persone, setSingoli, setQuoteMod, quoteMod,setAddQuota, setCliccato, cliccato}) {
    let soldiRidistribuire = singoli.find((p)=> p.selezionato);
    let quantiPrezzoBloccato = singoli.filter((i) => i.bloccato);
    let prezziBloccati = 0.0;
    let personeBloccate =0, denominatore = 0, numeratore=0, prezzoRestanti=0;
    for (const c of quantiPrezzoBloccato) {
        prezziBloccati += parseFloat(c.soldi)*parseInt(c.persona.split(" ")[0]);
        personeBloccate += parseInt(c.persona.split(" ")[0]);
    }
    
    if(soldiRidistribuire.bloccato){
        denominatore = parseInt( persone)  - personeBloccate +1;
        numeratore = parseFloat( totale) - prezziBloccati + parseFloat(soldiRidistribuire.soldi);
    }
    else{
        denominatore = parseInt( persone)  - personeBloccate;
        numeratore = parseFloat( totale) - prezziBloccati;
    }
    
    if(denominatore!==0 && numeratore>=0){
        prezzoRestanti = parseFloat(((numeratore) / (denominatore)).toFixed(2));
    }

    setSingoli(singoli.filter((p) => p.chiave !== cliccato.chiave ).map((r,i)=> {
        if(r.bloccato){
            return{...r,chiave:i}
        }
        else if(!r.bloccato && r.soldi!==-1){
            return{...r,chiave:i,soldi:prezzoRestanti}
        }
    }));
    setQuoteMod(quoteMod.filter((p) => p.chiave !== cliccato.chiave ).map((r,i)=> {
        if(r.bloccato){
            return{...r,chiave:i+1}
        }
        else if(!r.bloccato && r.soldi!==-1){
            return{...r,chiave:i+1,soldi:prezzoRestanti}
        }
    }));
    setAddQuota(true);
    setCliccato({persona: '1 quota', chiave: -1, soldi: 0, bloccato: false, selezionato: true })
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
            let tmp = { persona: cognome > 1 ? String(cognome).concat(nomi) : String(cognome).concat(nome), soldi: singoli.length>0 ? singoli[0].soldi : route.params.quotaxPers, bloccato: singoli.length>0 ? singoli[0].bloccato : false, chiave: 0, selezionato: false }
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
        setQuoteMod(quoteMod.map((p) => {
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
                setCliccato({persona: p.persona, chiave : p.chiave, soldi: p.soldi, bloccato : !p.bloccato, selezionato : p.selezionato});
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
        setQuoteMod(quoteMod.map((p)=>{
            if(p.selezionato){
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
        }))
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
                                            <GeneralQuote spazio={spazio} item={item[0]} flag={false} totale={route.params.totale} singoli={singoli} setSingoli={setSingoli} quoteMod={quoteMod} setQuoteMod={setQuoteMod} setDue={setDue} persone={route.params.persone} />
                                            <AggiungiQuote spazio={spazio} item={item[1]} quoteMod={quoteMod} setQuoteMod={setQuoteMod} setAddQuota={setAddQuota} setCliccato={setCliccato} singoli={singoli} setSingoli={setSingoli} totale={route.params.totale} persone={route.params.persone}/>
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
                                                <AggiungiQuote spazio={spazio} item={item} quoteMod={quoteMod} setQuoteMod={setQuoteMod} setAddQuota={setAddQuota} setCliccato={setCliccato} singoli={singoli} setSingoli={setSingoli} totale={route.params.totale} persone={route.params.persone}/> :
                                                item.chiave === 0 ? <GeneralQuote spazio={spazio} item={item} flag={true} totale={route.params.totale} singoli={singoli} setSingoli={setSingoli} quoteMod={quoteMod} setQuoteMod={setQuoteMod} setDue={setDue} persone={route.params.persone} /> :
                                                    <TouchableOpacity disabled={item.selezionato ? true : false} onLongPress={() => quotaPress(item)} >
                                                        <GeneralQuote spazio={spazio} item={item} flag={true} totale={route.params.totale} singoli={singoli} setSingoli={setSingoli} quoteMod={quoteMod} setQuoteMod={setQuoteMod} setDue={setDue} persone={route.params.persone}/>
                                                    </TouchableOpacity>}
                                            <QuotaVuota spazio={spazio}/>
                                        </View>
                                    )
                                }
                                else if (item.length === 2) {
                                    return (
                                        <View key={item[0].chiave} style={{ backgroundColor: '#121212', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 29 }}>
                                            <TouchableOpacity disabled={item[0].selezionato ? true : false} onLongPress={() => quotaPress(item[0])} >
                                                <GeneralQuote spazio={spazio} item={item[0]} flag={true} totale={route.params.totale} singoli={singoli} setSingoli={setSingoli} quoteMod={quoteMod} setQuoteMod={setQuoteMod} setDue={setDue} persone={route.params.persone}/>
                                            </TouchableOpacity>
                                            {item[1].soldi === -1 ?
                                                <AggiungiQuote spazio={spazio} item={item[1]} quoteMod={quoteMod} setQuoteMod={setQuoteMod} setAddQuota={setAddQuota} setCliccato={setCliccato} singoli={singoli} setSingoli={setSingoli} totale={route.params.totale} persone={route.params.persone}/> :
                                                <TouchableOpacity disabled={item[1].selezionato ? true : false} onLongPress={() => quotaPress(item[1])} >
                                                    <GeneralQuote spazio={spazio} item={item[1]} flag={true} totale={route.params.totale} singoli={singoli} setSingoli={setSingoli} quoteMod={quoteMod} setQuoteMod={setQuoteMod} setDue={setDue} persone={route.params.persone}/>
                                                </TouchableOpacity>}
                                        </View>
                                    )
                                }
                                else if (item.length === 3) {
                                    return (
                                        <View key={item[0].chiave}>
                                            <View style={{ backgroundColor: '#121212', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 29 }}>
                                                <TouchableOpacity disabled={item[0].selezionato ? true : false} onLongPress={() => quotaPress(item[0])} >
                                                    <GeneralQuote spazio={spazio} item={item[0]} flag={true} totale={route.params.totale} singoli={singoli} setSingoli={setSingoli} quoteMod={quoteMod} setQuoteMod={setQuoteMod} setDue={setDue} persone={route.params.persone} />
                                                </TouchableOpacity>
                                                <TouchableOpacity disabled={item[1].selezionato ? true : false} onLongPress={() => quotaPress(item[1])} >
                                                    <GeneralQuote spazio={spazio} item={item[1]} flag={true} totale={route.params.totale} singoli={singoli} setSingoli={setSingoli} quoteMod={quoteMod} setQuoteMod={setQuoteMod} setDue={setDue} persone={route.params.persone} />
                                                </TouchableOpacity>
                                            </View>
                                            <View style={{ backgroundColor: '#121212', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 29 }}>
                                                {item[2].soldi === -1 ?
                                                    <AggiungiQuote spazio={spazio} item={item[2]} quoteMod={quoteMod} setQuoteMod={setQuoteMod} setAddQuota={setAddQuota} setCliccato={setCliccato} singoli={singoli} setSingoli={setSingoli} totale={route.params.totale} persone={route.params.persone}/> :
                                                    <TouchableOpacity disabled={item[2].selezionato ? true : false} onLongPress={() => quotaPress(item[2])} >
                                                        <GeneralQuote spazio={spazio} item={item[2]} flag={true} totale={route.params.totale} singoli={singoli} setSingoli={setSingoli} quoteMod={quoteMod} setQuoteMod={setQuoteMod} setDue={setDue} persone={route.params.persone} />
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
                                                    <GeneralQuote spazio={spazio} item={item[0]} flag={true} totale={route.params.totale} singoli={singoli} setSingoli={setSingoli} quoteMod={quoteMod} setQuoteMod={setQuoteMod} setDue={setDue} persone={route.params.persone}/>
                                                </TouchableOpacity>
                                                <TouchableOpacity disabled={item[1].selezionato ? true : false} onLongPress={() => quotaPress(item[1])} >
                                                    <GeneralQuote spazio={spazio} item={item[1]} flag={true} totale={route.params.totale} singoli={singoli} setSingoli={setSingoli} quoteMod={quoteMod} setQuoteMod={setQuoteMod} setDue={setDue} persone={route.params.persone}/>
                                                </TouchableOpacity>
                                            </View>
                                            <View style={{ backgroundColor: '#121212', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 29 }}>
                                                <TouchableOpacity disabled={item[2].selezionato ? true : false} onLongPress={() => quotaPress(item[2])} >
                                                    <GeneralQuote spazio={spazio} item={item[2]} flag={true} totale={route.params.totale} singoli={singoli} setSingoli={setSingoli} quoteMod={quoteMod} setQuoteMod={setQuoteMod} setDue={setDue} persone={route.params.persone}/>
                                                </TouchableOpacity>
                                                {item[3].soldi === -1 ?
                                                    <AggiungiQuote spazio={spazio} item={item[3]} quoteMod={quoteMod} setQuoteMod={setQuoteMod} setAddQuota={setAddQuota} setCliccato={setCliccato} singoli={singoli} setSingoli={setSingoli} totale={route.params.totale} persone={route.params.persone}/> :
                                                    <TouchableOpacity disabled={item[3].selezionato ? true : false} onLongPress={() => quotaPress(item[3])} >
                                                        <GeneralQuote spazio={spazio} item={item[3]} flag={true} totale={route.params.totale} singoli={singoli} setSingoli={setSingoli} quoteMod={quoteMod} setQuoteMod={setQuoteMod} setDue={setDue} persone={route.params.persone}/>
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
                        <View style={[styles.viewButton2, { backgroundColor: 'red', marginLeft: 20, borderColor: 'red', opacity:quoteMod.length===0 || cliccato.chiave===-1 || finalState[0][0].selezionato ? 0.5 : 1 }]}>
                            <TouchableOpacity disabled={cliccato.chiave===-1 || cliccato.chiave===0 || quoteMod.length===0  ? true : false} onPress={() => { cancellaQuota({singoli: singoli,totale:route.params.totale, persone: route.params.persone, setSingoli:setSingoli, setQuoteMod:setQuoteMod, quoteMod:quoteMod,setAddQuota:setAddQuota, setCliccato:setCliccato,cliccato:cliccato})}} style={styles.touchButton}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }} >
                                    <Icon name='trash-o' size={21} color='white' />
                                    <Text style={styles.menuItemText}> Elimina quota</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={[styles.viewButton2, { backgroundColor: '#54d169', marginRight: 20, opacity:cliccato.chiave===-1 || quoteMod.length===0 ? 0.5 : 1 }]}>
                            <TouchableOpacity disabled={cliccato.chiave===-1 || quoteMod.length===0? true : false} onPress={() => { bloccaQuota() }} style={styles.touchButton}>
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
                            <TouchableOpacity onPress={() => navigation.navigate('riepilogo', { conto: route.params.conto, persone: route.params.persone, mancia: route.params.mancia, quotaxPers: route.params.quotaxPers, totale: route.params.totale, items: singoli[singoli.length-1].soldi===-1? singoli.slice(0,singoli.length-1) : singoli })} style={styles.touchButton}>
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
        width: 10,
        height: 10,
        borderRadius: 6,
        backgroundColor: 'white',
        marginHorizontal: 6,
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
    viewPreconto2: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20
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