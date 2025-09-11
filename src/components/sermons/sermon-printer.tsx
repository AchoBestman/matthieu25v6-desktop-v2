import { Sermon } from "@/schemas/sermon";
import {
  Page,
  Text,
  View,
  Image,
  Document,
  StyleSheet,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    padding: 20,
    backgroundColor: "#ffffff",
    fontSize: 10,
    fontFamily: "Helvetica",
  },
  title: {
    textAlign: "center",
    marginBottom: 10,
    fontWeight: "bold",
    fontSize: 18,
  },
  verseContainer: {
    marginBottom: 4,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  verseContentWrapper: {
    flex: 1,
  },
  verseTitle: {
    fontWeight: "bold",
    marginBottom: 4,
    marginTop: 4,
  },
  verseNumber: {
    fontWeight: "bold",
  },
  verseContent: {
    marginLeft: 4,
  },
  concordance: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 1,
  },
  concordanceItem: {
    marginRight: 3,
    marginBottom: 1,
    paddingHorizontal: 2,
    paddingVertical: 1,
    backgroundColor: "#bfdbfe",
    borderRadius: 2,
    fontSize: 10,
  },
  // Correction: Ajout d'un conteneur pour l'image
  imageContainer: {
    width: "100%", // Prend toute la largeur disponible
    marginBottom: 15, // Espacement après l'image
  },
  // Correction: Modification du style de l'image
  image: {
    width: "100%", // Prend toute la largeur du conteneur
    height: "auto", // Maintient les proportions
    //maxHeight: 200, // Hauteur maximale pour éviter que l'image ne soit trop grande
  },
  similarSermon: {
    marginTop: 6,
    fontStyle: "italic",
  },
});

export const SermonPrinter = ({
  sermon,
  sermonImage,
}: {
  sermon: Sermon;
  sermonImage?: { name: string; blobUrl: string | null };
}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>
        {sermon.chapter} :{" "}
        {`${sermon.title ?? ""} ${sermon.sub_title ?? ""}`.trim()}
      </Text>

      {/* Correction: Ajout d'un conteneur pour l'image */}
      {sermonImage?.blobUrl && (
        <View style={styles.imageContainer}>
          <Image src={sermonImage.blobUrl} style={styles.image} />
        </View>
      )}

      {sermon.verses?.map((verset) => (
        <View key={verset.number} style={styles.verseContainer}>
          <View style={styles.verseContentWrapper}>
            {verset.title && (
              <Text style={styles.verseTitle}>{verset.title}</Text>
            )}

            <Text>
              <Text style={styles.verseNumber}>{verset.number}.</Text>
              <Text style={styles.verseContent}>{verset.content}</Text>
            </Text>

            <View style={styles.concordance}>
              {verset.concordances?.concordance.map((value: any) => (
                <Text
                  key={`${value.sermon_number}-${value.verse_number}`}
                  style={styles.concordanceItem}
                >
                  {value.label}
                </Text>
              ))}
            </View>
          </View>
        </View>
      ))}

      {sermon.similar_sermon && (
        <Text style={styles.similarSermon}>{sermon.similar_sermon}</Text>
      )}
    </Page>
  </Document>
);
