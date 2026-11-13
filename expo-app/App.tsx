import React, { useMemo, useState } from "react";
import { FlatList, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { StatusBar } from "expo-status-bar";

const ITEMS = Array.from({ length: 5000 }, (_, i) => ({ id: String(i + 1), title: "Benchmark item " + String(i + 1).padStart(4, "0"), subtitle: "Scrollable row #" + (i + 1) }));
const SCREENS = Array.from({ length: 20 }, (_, i) => "Screen " + String(i + 1).padStart(2, "0"));

export default function App() {
  const [screen, setScreen] = useState("Home");
  const [query, setQuery] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("Ready");
  const [selected, setSelected] = useState("No item selected");
  const [pulse, setPulse] = useState(0);
  const filtered = useMemo(() => ITEMS.filter(x => x.title.toLowerCase().includes(query.toLowerCase())).slice(0, 250), [query]);

  return <SafeAreaView style={styles.safe}>
    <StatusBar style="dark" />
    <View style={styles.header}>
      <Text style={styles.brand}>Flet vs Expo Benchmark</Text>
      <Text style={styles.status}>{message}</Text>
    </View>
    <View style={styles.tabs}>
      {["Home", "List", "Form", "Motion", "Screens"].map(item =>
        <Pressable key={item} onPress={() => { setScreen(item); setMessage(item + " opened"); }} style={[styles.tab, screen === item && styles.activeTab]}>
          <Text style={[styles.tabText, screen === item && styles.activeText]}>{item}</Text>
        </Pressable>
      )}
    </View>
    <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent}>
      {screen === "Home" && <>
        <Text style={styles.heading}>Cross-platform benchmark</Text>
        <Text style={styles.copy}>Equivalent interaction scenarios implemented in Flet and Expo.</Text>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Benchmark scenarios</Text>
          <Text>20 navigable screens • 5,000-row list • form validation • motion • repeated navigation</Text>
          <Text style={styles.note}>Use the same device, release build, and test sequence for a fair comparison.</Text>
        </View>
        {["List", "Form", "Motion", "Screens"].map(x => <Pressable key={x} style={styles.button} onPress={() => setScreen(x)}><Text style={styles.buttonText}>Open {x}</Text></Pressable>)}
        <Text style={styles.note}>CI builds are not device-performance measurements.</Text>
      </>}
      {screen === "List" && <>
        <Text style={styles.heading}>Large list</Text>
        <Text>5,000 generated records; maximum 250 matching rows rendered.</Text>
        <TextInput value={query} onChangeText={setQuery} placeholder="Search 5,000 rows" style={styles.input} />
        <Text>{selected}</Text>
        <FlatList scrollEnabled={false} data={filtered} keyExtractor={x => x.id} renderItem={({ item }) =>
          <Pressable style={styles.listRow} onPress={() => setSelected("Selected: " + item.title + " (id=" + item.id + ")")}>
            <Text style={styles.rowTitle}>{item.title}</Text><Text style={styles.note}>{item.subtitle}</Text>
          </Pressable>} />
      </>}
      {screen === "Form" && <>
        <Text style={styles.heading}>Form validation</Text>
        <TextInput value={name} onChangeText={setName} placeholder="Name" style={styles.input} />
        <TextInput value={email} onChangeText={setEmail} placeholder="Email" keyboardType="email-address" autoCapitalize="none" style={styles.input} />
        <Pressable style={styles.button} onPress={() => setMessage(name.trim() && email.includes("@") ? "Submitted locally for " + name : "Validation failed: enter a name and valid email.")}><Text style={styles.buttonText}>Validate and submit</Text></Pressable>
      </>}
      {screen === "Motion" && <>
        <Text style={styles.heading}>Motion scenario</Text>
        <Text>Tap the tile repeatedly and compare frame pacing on-device.</Text>
        <Pressable style={[styles.motion, { transform: [{ scale: pulse % 2 ? 1.12 : 0.88 }], opacity: pulse % 2 ? 1 : 0.55 }]} onPress={() => setPulse(x => x + 1)}>
          <Text style={styles.buttonText}>EXPO · Tap {pulse}</Text>
        </Pressable>
      </>}
      {screen === "Screens" && <>
        <Text style={styles.heading}>Navigation screens</Text>
        {SCREENS.map((item, i) => <Pressable key={item} style={styles.listRow} onPress={() => { setScreen(item); setMessage(item + " opened"); }}>
          <Text style={styles.rowTitle}>{item}</Text><Text style={styles.note}>Navigation workload · {i + 1} / 20</Text>
        </Pressable>)}
      </>}
      {SCREENS.includes(screen) && <>
        <Text style={styles.heading}>{screen}</Text><Text>Navigation workload screen.</Text>
        <Text>Screen index: {SCREENS.indexOf(screen) + 1} / 20</Text>
        <Pressable style={styles.button} onPress={() => setScreen("Home")}><Text style={styles.buttonText}>Back to benchmark home</Text></Pressable>
      </>}
    </ScrollView>
  </SafeAreaView>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f7f8fc" },
  header: { paddingHorizontal: 16, paddingTop: 8, paddingBottom: 10 },
  brand: { fontSize: 18, fontWeight: "800", color: "#172033" },
  status: { fontSize: 11, color: "#65708a", marginTop: 4 },
  tabs: { flexDirection: "row", flexWrap: "wrap", paddingHorizontal: 8, gap: 6 },
  tab: { paddingVertical: 9, paddingHorizontal: 11, borderRadius: 9, backgroundColor: "#e9ecf4" },
  activeTab: { backgroundColor: "#273c91" },
  tabText: { fontSize: 12, color: "#26314b" },
  activeText: { color: "white", fontWeight: "700" },
  body: { flex: 1 },
  bodyContent: { padding: 16, gap: 12 },
  heading: { fontSize: 24, fontWeight: "800", color: "#172033" },
  copy: { color: "#4c5872" },
  card: { backgroundColor: "white", borderRadius: 14, padding: 16, gap: 9 },
  cardTitle: { fontWeight: "800", fontSize: 16 },
  note: { fontSize: 12, color: "#69748b" },
  button: { backgroundColor: "#273c91", padding: 14, borderRadius: 10, alignItems: "center" },
  buttonText: { color: "white", fontWeight: "700" },
  input: { backgroundColor: "white", borderColor: "#d7dce8", borderWidth: 1, borderRadius: 10, padding: 12 },
  listRow: { backgroundColor: "white", padding: 12, borderBottomWidth: 1, borderBottomColor: "#e5e8ef" },
  rowTitle: { fontWeight: "700", color: "#172033" },
  motion: { width: 150, height: 110, borderRadius: 18, backgroundColor: "#273c91", alignItems: "center", justifyContent: "center", alignSelf: "center", marginVertical: 30 }
});
