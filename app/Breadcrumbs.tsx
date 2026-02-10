import React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  showHomeIcon?: boolean;
  maxVisibleItems?: number;
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({
  items,
  showHomeIcon = false,
  maxVisibleItems = 3,
}) => {
  const renderBreadcrumbItems = () => {
    if (items.length <= maxVisibleItems) {
      return items.map((item, index) =>
        renderBreadcrumbItem(item, index, items.length)
      );
    }

    // Show first item, ellipsis, and last few items
    const firstItem = items[0];
    const lastItems = items.slice(-(maxVisibleItems - 1));

    return (
      <>
        {renderBreadcrumbItem(firstItem, 0, items.length)}
        <li className="flex items-center">
          <span className="text-gray-400 mx-1 sm:mx-2">...</span>
          <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 mx-1 sm:mx-2 text-gray-400" />
        </li>
        {lastItems.map((item, index) =>
          renderBreadcrumbItem(
            item,
            items.length - lastItems.length + index,
            items.length
          )
        )}
      </>
    );
  };

  const renderBreadcrumbItem = (
    item: BreadcrumbItem,
    index: number,
    totalLength: number
  ) => {
    const isLast = index === totalLength - 1;

    return (
      <li key={`${item.href}-${index}`} className="flex items-center">
        {!isLast ? (
          <>
            <Link
              href={item.href}
              className="text-xs sm:text-sm text-gray-600 hover:text-[#fe7105] transition-colors duration-200 truncate max-w-[80px] sm:max-w-[120px] md:max-w-none"
              title={item.label}
            >
              {index === 0 && showHomeIcon ? (
                <span className="flex items-center gap-1">
                  <Home className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </span>
              ) : (
                item.label
              )}
            </Link>
            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 mx-1 sm:mx-2 text-gray-400 flex-shrink-0" />
          </>
        ) : (
          <span
            className="text-xs sm:text-sm font-medium text-black truncate max-w-[100px] sm:max-w-[150px] md:max-w-none"
            title={item.label}
          >
            {item.label}
          </span>
        )}
      </li>
    );
  };

  if (!items.length) return null;

  return (
    <nav
      className="flex mb-4 sm:mb-6 w-full overflow-hidden"
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center gap-1 sm:gap-2 text-sm font-semibold min-w-0 flex-1">
        {renderBreadcrumbItems()}
      </ol>
    </nav>
  );
};
