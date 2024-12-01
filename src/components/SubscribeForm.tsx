import { Button } from "./ui/button";

export default function SubscribeForm() {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <input
        type="email"
        placeholder="Email"
        className="px-4 py-2 rounded-xl"
      />
      <Button>Subscribe</Button>
    </div>
  );
}
