import { tr } from "@/translation";
import { Label } from "@/components/ui/label";

export default function TextFontSizeBar({
  setFontSize,
  fontSize,
  className,
}: Readonly<{
  fontSize: number;
  setFontSize: (fontSize: number) => void;
  className: string;
}>) {
  return (
    <div className={className}>
      <Label htmlFor="range" className="whitespace-nowrap cursor-pointer">
        {tr("text.font_size")}
      </Label>
      <input
        id="range"
        type="range"
        min="16"
        max="60"
        value={fontSize}
        onChange={(e) => {
          setFontSize(parseInt(e.target.value));
        }}
        className="ml-1 mt-1 w-3/5 cursor-pointer"
      />
    </div>
  );
}
