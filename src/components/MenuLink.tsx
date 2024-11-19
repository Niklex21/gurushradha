import type { MenuItemStoryblok } from "@/component-types";
import { twMerge } from "tailwind-merge";

export function MenuLink({
  item,
  pathname,
}: {
  item: MenuItemStoryblok;
  pathname: string;
}) {
  const href =
    item.link.linktype === "story" ? item.link.cached_url : item.link.url;
  const active = href === pathname.slice(1); // to remove the slash

  return (
    <div className="flex flex-col sm:flex-row relative group/menu">
      <a
        href={href}
        className={twMerge(
          "hover:text-[#A00A0A] uppercase font-bold text-black",
          active && "text-[#A00A0A]",
        )}
      >
        {item.name}
      </a>
      {item.submenus && item.submenus.length > 0 && (
        <div className="text-nowrap flex sm:absolute top-0 left-0 flex-col p-2 ml-2 sm:mt-6 gap-2 sm:-ml-2 rounded-xl bg-[#FEFCF5] sm:hidden group-hover/menu:flex">
          {item.submenus.map((submenu, index) => (
            <MenuLink item={submenu} pathname={pathname} key={index} />
          ))}
        </div>
      )}
    </div>
  );
}
