import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 20,
    backgroundColor: "#ffffff",
    fontSize: 12,
    fontFamily: "Helvetica",
  },
  songContainer: {
    marginBottom: 15,
  },
  songHeader: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  songTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 6,
  },
  albumTitle: {
    fontSize: 12,
    fontStyle: "italic",
    color: "#555",
  },
  songContent: {
    fontSize: 12,
    lineHeight: 1.5,
    marginTop: 6,
    textAlign: "justify",
  },
});

export const SongPrinter = ({
  song,
  albumTitle,
}: {
  song: { title: string; content?: string };
  albumTitle?: string;
}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.songContainer}>
        {/* Title + album */}
        <View style={styles.songHeader}>
          {/* <Text style={styles.songTitle}>{song.title}</Text> */}
          {albumTitle && <Text style={styles.songTitle}>{albumTitle}</Text>}
        </View>

        {/* Song content (handle line breaks) */}
        {song.content &&
          song.content.split("\n").map((line, index) => (
            <Text key={index} style={styles.songContent}>
              {line}
            </Text>
          ))}
      </View>
    </Page>
  </Document>
);
