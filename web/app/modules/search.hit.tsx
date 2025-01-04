import { Link } from "react-router";
import { PackageSemanticSearchHit } from "../data/package.shape";

export type SearchHit = { id: number; name: string };

export type SearchHitsResults = {
  authors: { hits: SearchHit[] };
  packages: {
    hits: {
      lexical: SearchHit[];
      semantic: PackageSemanticSearchHit[];
    };
  };
};

export function SemanticHit(props: {
  item: PackageSemanticSearchHit;
  onClick: () => void;
}) {
  const { item, onClick } = props;

  return (
    <Link to={`/package/${item.packageName}`} onClick={onClick}>
      {item.packageName}
    </Link>
  );
}
