import { Bleed as BleedComponent } from "./Bleed";
import { Meta } from "@storybook/react";
import React from "react";

export default {
  component: BleedComponent,
  title: "Components/Module/Bleed",
} as Meta;

export const BleedNone = () => (
  <div className="bg-neutral-100">
    <BleedComponent bleed="none">
      <div className="bg-neutral-900 p-10" />
    </BleedComponent>
  </div>
);

export const BleedSmall = () => (
  <div className="bg-neutral-100">
    <BleedComponent bleed="sm">
      <div className="bg-neutral-900 p-10" />
    </BleedComponent>
  </div>
);

export const BleedDefault = () => (
  <div className="bg-neutral-100">
    <BleedComponent bleed="md">
      <div className="bg-neutral-900 p-10" />
    </BleedComponent>
  </div>
);

export const BleedLarge = () => (
  <div className="bg-neutral-100">
    <BleedComponent bleed="lg">
      <div className="bg-neutral-900 p-10" />
    </BleedComponent>
  </div>
);
