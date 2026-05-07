"use client";

import dynamic from "next/dynamic";

const EventLocationMap = dynamic(() => import("./EventLocationMap"), { ssr: false });

export default function EventLocationMapWrapper(props: React.ComponentProps<typeof EventLocationMap>) {
  return <EventLocationMap {...props} />;
}
