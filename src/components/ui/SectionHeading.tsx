export function SectionHeading({
  number,
  title,
  description,
  compactTitle,
}: {
  number: string;
  title: string;
  description?: string;
  compactTitle?: string;
}) {
  return (
    <div className="section-heading">
      <div className="section-heading-title">
        <span className="section-number">{number}</span>
        <h2>{compactTitle ? <><span className="desktop-copy">{title}</span><span className="compact-copy">{compactTitle}</span></> : title}</h2>
      </div>
      {description && <p>{description}</p>}
    </div>
  );
}
