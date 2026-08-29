export default function IconDivider({
  icon = "diamond",
  className = "",
}: {
  icon?: "diamond" | "heart";
  className?: string;
}) {
  return (
    <div className={`icon-divider ${className}`}>
      <span className="icon-divider-line" />
      <span className={`icon-divider-glyph ${icon === "heart" ? "icon-divider-heart" : ""}`}>
        {icon === "heart" ? "♥" : "◆"}
      </span>
      <span className="icon-divider-line" />
    </div>
  );
}
