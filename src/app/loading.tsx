import BrandTransition from "@/components/BrandTransition";

// App Router shows this automatically while a page's server component is
// fetching data (Home, Archive, Profile, Complete) — gives every screen
// transition the same on-brand rosa loading bar instead of a blank flash.
export default function Loading() {
  return <BrandTransition />;
}
