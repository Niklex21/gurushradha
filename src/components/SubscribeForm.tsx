import { Button } from "./ui/button";

export default function SubscribeForm({
  label,
  url,
}: {
  label: string;
  url: string;
}) {
  return (
    <a className="flex no-underline" target="_blank" href={url}>
      <Button className="w-full sm:w-auto">{label}</Button>
    </a>
  );
}
