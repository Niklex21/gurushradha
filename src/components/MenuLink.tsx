import type { MenuItemStoryblok } from "@/component-types";
import { twMerge } from "tailwind-merge";
import SculptureSupport from "@/images/sculptures/support.png";

const ITEM_NAME_TO_SCULPTURE: {
  [key: string]: ImageMetadata | undefined;
} = {
  about: undefined,
  events: undefined,
  classes: undefined,
  gallery: undefined,
  support: SculptureSupport,
  contact: undefined,
};

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
          "hover:text-[#A00A0A] relative uppercase font-serif font-bold text-black group",
          active && "text-[#A00A0A]",
        )}
      >
        {ITEM_NAME_TO_SCULPTURE[item.name.toLowerCase()] !== undefined && (
          <img
            src={ITEM_NAME_TO_SCULPTURE[item.name.toLowerCase()]?.src}
            alt="sculpture"
            className={twMerge(
              "w-20 h-20 absolute top-1/2 left-1/2 -translate-x-[47%] -translate-y-[47%] opacity-50 group-hover:opacity-100 -z-[5]",
              active && "opacity-100",
            )}
          />
        )}
        {item.name}
      </a>
      {item.submenus && item.submenus.length > 0 && (
        <div className="text-nowrap flex sm:absolute top-0 left-0 flex-col p-4 ml-4 sm:mt-6 gap-4 sm:-ml-4 rounded-xl bg-[#FEFCF5] sm:hidden group-hover/menu:flex">
          {item.submenus.map((submenu, index) => (
            <MenuLink item={submenu} pathname={pathname} key={index} />
          ))}
        </div>
      )}
    </div>
  );
}
