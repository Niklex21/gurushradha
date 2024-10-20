import type { MenuItemStoryblok } from "@/component-types";
import { twMerge } from "tailwind-merge";

export function MenuLink({ item, pathname }: { item: MenuItemStoryblok, pathname: string }) {
    const href =
        item.link.linktype === 'story' ? item.link.cached_url : item.link.url;
    const active = href === pathname.slice(1); // to remove the slash

    return (
        <div className="flex relative group/menu">
            <a
                href={href}
                className={twMerge(
                    'hover:text-black uppercase font-bold text-black/50',
                    active && 'text-black'
                )}
            >
                {item.name}
            </a>
            {(item.submenus && item.submenus.length > 0) && (
                <div className="absolute top-0 left-0 flex-col p-2 mt-6 gap-2 -ml-2 rounded-xl bg-white hidden group-hover/menu:flex">
                    {item.submenus.map((submenu) => (
                        <MenuLink item={submenu} pathname={pathname} />
                    ))}
                </div>
            )}
        </div>
    );
}