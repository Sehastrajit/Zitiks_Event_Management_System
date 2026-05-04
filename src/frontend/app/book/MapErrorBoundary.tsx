"use client";

import { Component, type ReactNode } from "react";

type Props = {
  children: ReactNode;
};

type State = {
  hasError: boolean;
};

export default class MapErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error("Map render error:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-[440px] w-full items-center justify-center rounded-b-3xl bg-neutral-900 px-6 text-center">
          <div>
            <h3 className="text-lg font-semibold text-white">Map could not load</h3>
            <p className="mt-2 max-w-md text-sm text-white/50">
              Refresh once after the development server finishes compiling, or open the standalone map page.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
