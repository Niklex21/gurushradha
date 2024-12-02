import type { MenuItemStoryblok } from "@/component-types";
import { twMerge } from "tailwind-merge";
import SculptureSupport from "@/images/sculptures/support.svg";
import SculptureAbout from "@/images/sculptures/about.svg";
import SculptureClasses from "@/images/sculptures/classes.svg";
import SculptureGallery from "@/images/sculptures/gallery.svg";
import SculptureContact from "@/images/sculptures/contact.svg";
import SculptureEvents from "@/images/sculptures/events.svg";
import { getHref } from "@/utils";

const ITEM_NAME_TO_SCULPTURE: {
  [key: string]: ImageMetadata | undefined;
} = {
  about: SculptureAbout,
  events: SculptureEvents,
  classes: SculptureClasses,
  gallery: SculptureGallery,
  support: SculptureSupport,
  contact: SculptureContact,
};

export function MenuLink({
  item,
  pathname,
}: {
  item: MenuItemStoryblok;
  pathname: string;
}) {
  const href = item.link ? getHref(item.link) : undefined;
  const active = href === pathname.slice(1); // to remove the slash

  return (
    <div className="flex flex-col h-full sm:flex-row relative group/menu">
      {href ? (
        <a
          href={href}
          className={twMerge(
            "hover:text-[#A00A0A] text-xl h-full flex relative font-yatra font-bold text-black no-underline",
            active && "text-[#A00A0A]",
          )}
        >
          {ITEM_NAME_TO_SCULPTURE[item.name.toLowerCase()] !== undefined && (
            <img
              src={ITEM_NAME_TO_SCULPTURE[item.name.toLowerCase()]?.src}
              alt="sculpture"
              className={twMerge(
                "absolute h-20 w-auto aspect-auto top-1/2 left-1/2 -translate-x-[47%] -translate-y-[47%] opacity-30 group-hover/menu:opacity-70 -z-[5]",
                active && "opacity-70",
              )}
            />
          )}
          {item.name}
        </a>
      ) : (
        <div
          className={twMerge(
            "hover:text-[#A00A0A] text-xl h-full flex relative font-yatra font-bold text-black cursor-default",
          )}
        >
          {ITEM_NAME_TO_SCULPTURE[item.name.toLowerCase()] !== undefined && (
            <img
              src={ITEM_NAME_TO_SCULPTURE[item.name.toLowerCase()]?.src}
              alt="sculpture"
              className={twMerge(
                "absolute h-20 w-auto aspect-auto top-1/2 left-1/2 -translate-x-[47%] -translate-y-[47%] opacity-30 group-hover/menu:opacity-70 -z-[5]",
              )}
            />
          )}
          {item.name}
        </div>
      )}
      {item.submenus && item.submenus.length > 0 && (
        <div className="text-nowrap flex sm:absolute top-0 left-0 flex-col p-4 ml-4 sm:mt-6 gap-4 sm:-ml-4 rounded-xl sm:hidden group-hover/menu:flex">
          {item.submenus.map((submenu, index) => (
            <MenuLink item={submenu} pathname={pathname} key={index} />
          ))}
        </div>
      )}
    </div>
  );
}
