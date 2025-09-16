import { Text, Link } from "@react-pdf/renderer";
import { parseDocument } from "htmlparser2";

export const renderHtmlToPdf = (html: string) => {
  const dom = parseDocument(html);

  const renderNode = (node: any, i: number): any => {
    if (node.type === "text") {
      return <Text key={i}>{node.data}</Text>;
    }

    if (node.type === "tag") {
      switch (node.name) {
        case "strong":
        case "b":
          return (
            <Text key={i} style={{ fontWeight: "bold" }}>
              {node.children.map((child: any, j: number) => renderNode(child, j))}
            </Text>
          );

        case "em":
        case "i":
          return (
            <Text key={i} style={{ fontStyle: "italic" }}>
              {node.children.map((child: any, j: number) => renderNode(child, j))}
            </Text>
          );

        case "br":
          return <Text key={i}>{"\n"}</Text>;

        case "a":
          return (
            <Link key={i} src={node.attribs?.href ?? "#"} style={{ color: "blue" }}>
              {node.children.map((child: any, j: number) => renderNode(child, j))}
            </Link>
          );

        case "h1":
        case "h2":
        case "h3":
        case "h4":
        case "h5":
        case "h6":
          return (
            <Text key={i} style={{ fontWeight: "bold", fontSize: 14, marginVertical: 4 }}>
              {node.children.map((child: any, j: number) => renderNode(child, j))}
            </Text>
          );

        default:
          // 🚨 pour toute autre balise : ignorer la balise mais garder le texte
          return node.children.map((child: any, j: number) => renderNode(child, j));
      }
    }

    return null;
  };

  return dom.children.map((node: any, i: number) => renderNode(node, i));
};
