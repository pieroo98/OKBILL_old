import React from 'react';
import { Text, View, StyleSheet} from 'react-native';

const ParametriGenerali = ({ conto, persone, totale, mancia  }) => {
    let coloreConto, colorePersone, coloreMancia, coloreTotale, manciaOpaco;
    coloreConto = colorePersone = coloreMancia = coloreTotale = 'white';
    if ( conto > 0)
        coloreConto = '#54D169';
    else if ( conto == 0)
        coloreConto = 'white';

    if ( persone > 2)
        colorePersone = '#54D169';
    else if ( persone == 0)
        colorePersone = 'white';

    if ( mancia > 0) {
        coloreMancia = '#54D169';
        manciaOpaco = 1;
    }
    else if ( mancia == 0) {
        coloreMancia = 'white';
        manciaOpaco = 0.5
    }
    if ( totale > 0)
        coloreTotale = '#54D169';
    else if ( totale == 0)
        coloreTotale = 'white';

    return (
        <View style={{ backgroundColor: '#222222' }}>
            <View style={{ backgroundColor: '#171717' }}>
                <View style={[styles.viewPreconto2, { backgroundColor: '#1D1D1D' }]}>
                    <View style={styles.viewSinglePreconto2}>
                        <Text style={styles.testoPreconto2}>Conto</Text>
                        <View style={[styles.preconto2, { marginTop: 20, borderColor: coloreConto, backgroundColor: '#1D1D1D' }]}>
                            <Text style={{ color: "white", fontSize: 14, fontFamily:'Montserrat-Regular' }}>{ conto + ' €'}</Text>
                        </View>
                    </View>
                    <View style={styles.viewSinglePreconto2}>
                        <Text style={[styles.testoPreconto2, { marginBottom: 20 }]}>Persone</Text>
                        <View style={[styles.preconto2, { borderColor: colorePersone, backgroundColor: '#1D1D1D' }]}>
                            <Text style={{ color: "white", fontSize: 14, fontFamily:'Montserrat-Regular' }}>{ persone}</Text>
                        </View>
                    </View>
                </View>
            </View>

            <View style={{ backgroundColor: '#1D1D1D' }}>
                <View style={[styles.viewPreconto2, { backgroundColor: '#222222' }]}>
                    <View style={styles.viewSinglePreconto2}>
                        <Text style={styles.testoPreconto2}>Mancia</Text>
                        <View style={[styles.preconto2, { marginTop: 20, borderColor: coloreMancia, backgroundColor: '#222222' }]}>
                            <Text style={{ color: "white", fontSize: 14, opacity: manciaOpaco,  fontFamily:'Montserrat-Regular' }}>{ mancia + '%'}</Text>
                        </View>
                    </View>
                    <View style={styles.viewSinglePreconto2}>
                        <Text style={[styles.testoPreconto2, { marginBottom: 20 }]}>Totale</Text>
                        <View style={[styles.preconto2, { borderColor: coloreTotale, backgroundColor: '#222222' }]}>
                            <Text style={{ color: "white", fontSize: 14, fontFamily:'Montserrat-Regular' }}>{ totale + '€'}</Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
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
        marginLeft: 20,
        fontFamily:'Montserrat-Regular'
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
    }
});

export default ParametriGenerali;