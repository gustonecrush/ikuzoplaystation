import React from 'react';
import { Document, Page, Text, View, StyleSheet, PDFViewer } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  container: {
    padding: 16,
    maxWidth: 800,
    margin: 'auto',
  },
  section: {
    marginBottom: 8,
    paddingHorizontal: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingHorizontal: 3,
  },
  logo: {
    width: 100,
    height: 50,
  },
  border: {
    borderBottomWidth: 2,
    borderColor: '#CCCCCC',
    marginBottom: 8,
  },
  total: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
    paddingHorizontal: 3,
  },
});

const Invoice = () => {
  return (
    <PDFViewer style={{ width: '100%', height: '100vh' }}>
      <Document>
        <Page size="A4" style={styles.container}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={{ fontSize: 20 }}>Example Invoice #</Text>
                <Text>Date: January 1st 2019</Text>
              </View>
              <View>
                <Image src="https://www.stenvdb.be/assets/img/email-signature.png" style={styles.logo} />
              </View>
            </View>
            <View style={styles.border}></View>
            <View style={styles.section}>
              <Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit...</Text>
            </View>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text>Development</Text>
                <Text style={{ textAlign: 'right', fontWeight: 'bold' }}>1200 EUR</Text>
              </View>
              <View style={styles.sectionHeader}>
                <Text>Design</Text>
                <Text style={{ textAlign: 'right', fontWeight: 'bold' }}>800 EUR</Text>
              </View>
              <View style={styles.sectionHeader}>
                <Text>Licensing</Text>
                <Text style={{ textAlign: 'right', fontWeight: 'bold' }}>300 EUR</Text>
              </View>
            </View>
            <View style={styles.total}>
              <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Total:</Text>
              <Text style={{ fontSize: 20, fontWeight: 'bold' }}>2300 EUR</Text>
            </View>
            <View style={styles.section}>
              <Text>To be paid before Februari 1st 2019 on <Text style={{ fontWeight: 'bold' }}>BE71 0961 2345 6769</Text> specifying the invoice #</Text>
            </View>
            <View style={styles.section}>
              <Text style={{ fontSize: 24, textAlign: 'center' }}>Thank you!</Text>
            </View>
            <View style={styles.section}>
              <Text style={{ textAlign: 'center' }}>hello@yourdomain.com ∖ www.yourdomain.com</Text>
            </View>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
}

export default Invoice;
