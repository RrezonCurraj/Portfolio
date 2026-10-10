import { portfolioCopy } from "@/data/portfolio";
import { cn } from "@/lib/utils";

export function MobileNavigation({ items, activeId }: {
  items: readonly { id: string; label: string }[];
  activeId: string;
}): React.JSX.Element {
  return (
    <nav className="mobile-section-nav" aria-label={portfolioCopy.header.mobileSections}>
      {items.map(item => (
        <a key={item.id} href={`#${item.id}`}
          className={cn("mobile-section-link", activeId === item.id && "is-active")}
          aria-current={activeId === item.id ? "location" : undefined}>
          {item.label}
        </a>
      ))}
    </nav>
  );
}
