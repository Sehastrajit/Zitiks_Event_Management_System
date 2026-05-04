"use client";

import dynamic from "next/dynamic";

// Isolate the dynamic import so page.tsx can statically import this file
export default dynamic(() => import("./EventMap"), { ssr: false });
