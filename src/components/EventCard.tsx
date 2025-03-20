import type { EventStoryblok } from "@/component-types";
import { CalendarIcon, LinkIcon, MapPinIcon } from "lucide-react";

export default function EventCard({ event }: { event: EventStoryblok }) {
  return (
    <div className="w-full flex flex-col sm:grid sm:grid-cols-3 rounded-xl overflow-hidden border-gray-200 border-2">
      <img
        src={event.image.filename ?? undefined}
        alt={event.image.alt ?? undefined}
        className="w-full h-full object-cover col-span-1"
      />
      <div className="p-6 flex flex-col gap-4 col-span-2">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4">{event.name}</h1>
        <div className="grid grid-cols-[1fr,auto] gap-y-2 gap-x-4 items-center mr-auto">
          <span className="">
            <CalendarIcon />
          </span>
          <span className="">
            {new Date(event.date ?? "").toLocaleString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
              hour: "numeric",
              minute: "numeric",
              hour12: true,
            })}
          </span>
          <span className="">
            <MapPinIcon />
          </span>
          <span className="w-full">{event.location}</span>
          {event.link && event.link.linktype === "url" && (
            <>
              <span className="">
                <LinkIcon />
              </span>
              <span className="w-full">
                <a
                  href={event.link.url}
                  target={event.link.target}
                  rel={event.link.rel}
                  title={event.link.title}
                >
                  {event.link.url}
                </a>
              </span>
            </>
          )}
        </div>
        {event.description && (
          <span className="text-sm text-gray-500">{event.description}</span>
        )}
      </div>
    </div>
  );
}
